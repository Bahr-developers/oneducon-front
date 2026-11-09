import type { product } from '@/@types'
import type { CreateImportPayload, ImportItemDraft } from '@/@types/imports'
import PaginationContyent from '@/components/_components/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DateRangeFields } from '@/components/functions/date-range-fields'
import { formatDate, formatDateServer, formatPrice } from '@/lib/utils'
import { importUtils } from '@/utils/imports'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import {
	ArrowDownToLine,
	CalendarDays,
	CircleCheck,
	ClipboardList,
	LoaderCircle,
	PackageOpen,
	Plus,
	ReceiptText,
	ChevronRight,
	Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { ProductSearch } from './product-search'

const integerPattern = /^\d+$/
const decimalPattern = /^\d*\.?\d*$/

type ImportItemField = keyof Omit<ImportItemDraft, 'product'>

function convertPrice(value: string, rate: number, currency: 'UZS' | 'USD') {
	if (value === '' || !Number.isFinite(Number(value))) return ''
	const converted = currency === 'UZS'
		? Math.round(Number(value) * rate)
		: Math.round((Number(value) / rate) * 100) / 100
	return Number.isFinite(converted) ? String(converted) : ''
}

function updateImportItem(item: ImportItemDraft, field: ImportItemField, value: string): ImportItemDraft {
	const updated = { ...item, [field]: value }
	const rate = Number(updated.usdRate)
	if (!Number.isFinite(rate) || rate <= 0) return updated

	switch (field) {
		case 'usdRate':
			return {
				...updated,
				costPrice: convertPrice(updated.costPriceUsd, rate, 'UZS'),
				salePrice: convertPrice(updated.salePriceUsd, rate, 'UZS'),
			}
		case 'costPrice':
			return { ...updated, costPriceUsd: convertPrice(value, rate, 'USD') }
		case 'costPriceUsd':
			return { ...updated, costPrice: convertPrice(value, rate, 'UZS') }
		case 'salePrice':
			return { ...updated, salePriceUsd: convertPrice(value, rate, 'USD') }
		case 'salePriceUsd':
			return { ...updated, salePrice: convertPrice(value, rate, 'UZS') }
		default:
			return updated
	}
}

function isNonNegativePrice(value: string, decimal = false) {
	const number = Number(value)
	return value !== '' && Number.isFinite(number) && number >= 0 &&
		(decimal ? decimalPattern.test(value) : Number.isSafeInteger(number) && integerPattern.test(value))
}

function getErrorMessage(error: unknown) {
	const axiosError = error as AxiosError<{ message?: string | string[] }>
	const message = axiosError.response?.data?.message
	if (Array.isArray(message)) return message[0] || 'Kirimni saqlab bo‘lmadi'
	return message || 'Kirimni saqlab bo‘lmadi. Ma’lumotlarni tekshirib qayta urinib ko‘ring.'
}

export default function ImportsPage() {
	const queryClient = useQueryClient()
	const [items, setItems] = useState<ImportItemDraft[]>([])
	const [note, setNote] = useState('')
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const [from, setFrom] = useState<Date | undefined>()
	const [to, setTo] = useState<Date | undefined>()
	const fromParam = formatDateServer(from)
	const toParam = formatDateServer(to)

	const historyQuery = useQuery({
		queryKey: ['imports-history', page, limit, fromParam, toParam],
		queryFn: () => importUtils.getHistory({ page, limit, from: fromParam, to: toParam }),
	})

	const total = useMemo(
		() =>
			items.reduce((sum, item) => {
				const quantity = Number(item.quantity)
				const costPrice = Number(item.costPrice)
				return sum + (Number.isFinite(quantity * costPrice) ? quantity * costPrice : 0)
			}, 0),
		[items],
	)

	const validationError = useMemo(() => {
		if (items.length === 0) return 'Kamida bitta mahsulot tanlang'
		for (const item of items) {
			if (!isNonNegativePrice(item.usdRate, true) || Number(item.usdRate) <= 0)
				return `${item.product.name}: USD kursi 0 dan katta son bo‘lishi kerak`
			if (!integerPattern.test(item.quantity) || !Number.isSafeInteger(Number(item.quantity)) || Number(item.quantity) <= 0)
				return `${item.product.name}: miqdor musbat butun son bo‘lishi kerak`
			if (!isNonNegativePrice(item.costPrice))
				return `${item.product.name}: tannarx 0 yoki undan katta butun son bo‘lishi kerak`
			if (!isNonNegativePrice(item.salePrice) || !isNonNegativePrice(item.wholesalePrice))
				return `${item.product.name}: narxlar 0 yoki undan katta butun son bo‘lishi kerak`
			if (!isNonNegativePrice(item.costPriceUsd, true) || !isNonNegativePrice(item.salePriceUsd, true))
				return `${item.product.name}: USD narxlari 0 yoki undan katta son bo‘lishi kerak`
		}
		if (note.length > 1000) return 'Izoh 1000 belgidan oshmasligi kerak'
		return null
	}, [items, note])

	const createImport = useMutation({
		mutationFn: (payload: CreateImportPayload) => importUtils.create(payload),
		onSuccess: (response, payload) => {
			toast.success(`Kirim saqlandi: ${formatPrice(response.data.total_price)}`)
			setItems([])
			setNote('')
			setPage(1)
			queryClient.invalidateQueries({ queryKey: ['imports-history'] })
			queryClient.invalidateQueries({ queryKey: ['get_all_products'] })
			queryClient.invalidateQueries({ queryKey: ['import-product-search'] })
			for (const item of payload.items) {
				const id = String(item.productId)
				queryClient.invalidateQueries({ queryKey: ['product-details', id] })
				queryClient.invalidateQueries({ queryKey: ['product-inventory-movements', id] })
			}
		},
		onError: error => toast.error(getErrorMessage(error)),
	})

	const addProduct = (selected: product) => {
		if (items.some(item => Number(item.product.id) === Number(selected.id))) return
		setItems(current => [
			...current,
			{
				product: selected,
				quantity: '1',
				usdRate: selected.usd_rate > 0 ? String(selected.usd_rate) : '',
				costPrice: String(selected.cost_price ?? 0),
				salePrice: String(selected.sale_price ?? 0),
				costPriceUsd: String(selected.cost_price_usd ?? 0),
				salePriceUsd: String(selected.sale_price_usd ?? 0),
				wholesalePrice: String(selected.wholesale_price ?? selected.cost_price ?? 0),
			},
		])
	}

	const updateItem = (id: string, field: ImportItemField, value: string) => {
		const decimal = field === 'costPriceUsd' || field === 'salePriceUsd' || field === 'usdRate'
		const normalizedValue = decimal ? value.replace(',', '.') : value
		if (!(decimal ? decimalPattern : /^\d*$/).test(normalizedValue)) return
		setItems(current =>
			current.map(item =>
				item.product.id === id ? updateImportItem(item, field, normalizedValue) : item,
			),
		)
	}

	const submit = () => {
		if (createImport.isPending) return
		if (validationError) {
			toast.error(validationError)
			return
		}
		const payload: CreateImportPayload = {
			items: items.map(item => ({
				usd_rate: Number(item.usdRate),
				productId: Number(item.product.id),
				quantity: Number(item.quantity),
				costPrice: Number(item.costPrice),
				salePrice: Number(item.salePrice),
				costPriceUsd: Number(item.costPriceUsd),
				salePriceUsd: Number(item.salePriceUsd),
				wholesalePrice: Number(item.wholesalePrice),
			})),
			note: note.trim(),
		}
		createImport.mutate(payload)
	}

	return (
		<div className='mx-auto w-full max-w-[1500px] space-y-8 pb-8'>
			<header className='flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<div className='mb-2 flex items-center gap-2 text-sm font-medium text-[#536BE8]'>
						<ArrowDownToLine className='size-4' /> Ombor operatsiyasi
					</div>
					<h1 className='text-2xl font-medium tracking-[-0.02em] sm:text-3xl'>Mahsulot kirimi</h1>
					<p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
						Mavjud mahsulotlarni tanlang, yangi partiya miqdori va tannarxini kiriting.
					</p>
				</div>
				<div className='flex items-center gap-2 rounded-lg bg-[#EEF1FF] px-3 py-2 text-sm text-[#4359C5] dark:bg-[#6A81FF]/15 dark:text-[#AEB9FF]'>
					<CircleCheck className='size-4' /> Ombordagi son avtomatik oshadi
				</div>
			</header>

			<section className='grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]'>
				<div className='min-w-0 space-y-4'>
					<ProductSearch disabledProductIds={items.map(item => Number(item.product.id))} onSelect={addProduct} />

					<div className='overflow-hidden rounded-xl border bg-background'>
						<div className='flex items-center justify-between border-b bg-muted/35 px-4 py-3'>
							<div className='flex items-center gap-2 font-medium'>
								<ClipboardList className='size-5 text-[#6A81FF]' /> Kirim tarkibi
							</div>
							<span className='text-sm text-muted-foreground'>{items.length} tur mahsulot</span>
						</div>

						{items.length === 0 ? (
							<div className='flex min-h-56 flex-col items-center justify-center px-5 text-center'>
								<div className='mb-3 flex size-12 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#536BE8] dark:bg-[#6A81FF]/15'>
									<PackageOpen className='size-6' />
								</div>
								<p className='font-medium'>Kirim ro‘yxati hozircha bo‘sh</p>
								<p className='mt-1 text-sm text-muted-foreground'>Yuqoridagi qidiruv orqali mahsulot qo‘shing.</p>
							</div>
						) : (
							<div className='overflow-x-auto'>
								<div className='min-w-[1240px]'>
									<div className='grid grid-cols-[minmax(210px,1.5fr)_100px_140px_140px_140px_140px_150px_42px] gap-3 border-b bg-muted/20 px-4 py-2.5 text-xs font-medium text-muted-foreground'>
										<span>Mahsulot</span>
										<span>Miqdor *</span>
										<span>USD kursi (UZS) *</span>
										<span>Tannarx *</span>
										<span>Sotuv narxi *</span>
										<span>Ulgurji narx (UZS) *</span>
										<span className='text-right'>Qator jami</span>
										<span />
									</div>
									<div className='divide-y'>
								{items.map((item, index) => (
									<div key={item.product.id} className='grid grid-cols-[minmax(210px,1.5fr)_100px_140px_140px_140px_140px_150px_42px] items-center gap-3 px-4 py-3'>
										<div className='min-w-0'>
											<div className='flex items-start gap-3'>
												<span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF1FF] text-sm font-medium text-[#536BE8] dark:bg-[#6A81FF]/15'>{index + 1}</span>
												<div className='min-w-0'>
													<p className='truncate font-medium'>{item.product.name}</p>
													<p className='mt-0.5 text-xs text-muted-foreground'>Hozir: {item.product.quantity} {item.product.unit?.name || 'dona'}</p>
												</div>
											</div>
										</div>
										<NumberField ariaLabel={`${item.product.name} miqdori`} value={item.quantity} onChange={value => updateItem(item.product.id, 'quantity', value)} />
										<NumberField ariaLabel={`${item.product.name} USD kursi`} decimal value={item.usdRate} onChange={value => updateItem(item.product.id, 'usdRate', value)} changed={Number(item.usdRate) !== Number(item.product.usd_rate)} />
										<div className='space-y-2'>
											<NumberField ariaLabel={`${item.product.name} tannarxi (UZS)`} currency='UZS' value={item.costPrice} onChange={value => updateItem(item.product.id, 'costPrice', value)} />
											<NumberField ariaLabel={`${item.product.name} tannarxi (USD)`} currency='USD' value={item.costPriceUsd} onChange={value => updateItem(item.product.id, 'costPriceUsd', value)} changed={Number(item.costPriceUsd) !== Number(item.product.cost_price_usd ?? 0)} />
										</div>
										<div className='space-y-2'>
											<NumberField ariaLabel={`${item.product.name} sotuv narxi (UZS)`} currency='UZS' value={item.salePrice} onChange={value => updateItem(item.product.id, 'salePrice', value)} changed={Number(item.salePrice) !== Number(item.product.sale_price)} />
											<NumberField ariaLabel={`${item.product.name} sotuv narxi (USD)`} currency='USD' value={item.salePriceUsd} onChange={value => updateItem(item.product.id, 'salePriceUsd', value)} changed={Number(item.salePriceUsd) !== Number(item.product.sale_price_usd ?? 0)} />
										</div>
										<NumberField ariaLabel={`${item.product.name} ulgurji narxi`} value={item.wholesalePrice} onChange={value => updateItem(item.product.id, 'wholesalePrice', value)} changed={Number(item.wholesalePrice) !== Number(item.product.wholesale_price)} />
										<div className='text-right text-sm font-medium tabular-nums'>{formatPrice(Number(item.quantity || 0) * Number(item.costPrice || 0))}</div>
										<Button type='button' variant='ghost' size='icon' aria-label={`${item.product.name}ni olib tashlash`} onClick={() => setItems(current => current.filter(row => row.product.id !== item.product.id))} className='text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30'>
											<Trash2 />
										</Button>
									</div>
								))}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<aside className='space-y-4 xl:sticky xl:top-20'>
					<div className='overflow-hidden rounded-xl border bg-[#18204A] text-white shadow-[0_18px_50px_rgba(25,36,92,0.18)]'>
						<div className='border-b border-white/10 p-5'>
							<p className='text-sm text-white/65'>Kirim qiymati</p>
							<p className='mt-2 break-words text-2xl font-medium tracking-[-0.03em]'>{formatPrice(total)}</p>
						</div>
						<div className='space-y-3 p-5 text-sm'>
							<div className='flex justify-between text-white/65'><span>Mahsulot turi</span><span className='text-white'>{items.length}</span></div>
							<div className='flex justify-between text-white/65'><span>Jami birlik</span><span className='text-white'>{items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</span></div>
							<Button onClick={submit} disabled={createImport.isPending || items.length === 0} className='mt-2 h-11 w-full bg-[#7F93FF] text-white hover:bg-[#91A1FF]'>
								{createImport.isPending ? <LoaderCircle className='animate-spin' /> : <Plus />}
								Kirimni saqlash
							</Button>
						</div>
					</div>
					<div className='rounded-xl border bg-background p-4'>
						<label htmlFor='import-note' className='text-sm font-medium'>Izoh</label>
						<Textarea id='import-note' value={note} maxLength={1000} onChange={event => setNote(event.target.value)} placeholder='Masalan: yangi yetkazib beruvchi partiyasi' className='mt-2 min-h-24 resize-y' />
						<p className='mt-1 text-right text-xs text-muted-foreground'>{note.length}/1000</p>
					</div>
				</aside>
			</section>

			<section className='space-y-4 pt-2'>
				<div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
					<div>
						<h2 className='flex items-center gap-2 text-xl font-medium'><ReceiptText className='size-5 text-[#6A81FF]' /> Kirimlar tarixi</h2>
						<p className='mt-1 text-sm text-muted-foreground'>Saqlangan ombor kirimlarini sana bo‘yicha ko‘ring.</p>
					</div>
					<DateRangeFields from={from} to={to} onFromChange={value => { setFrom(value); setPage(1) }} onToChange={value => { setTo(value); setPage(1) }} />
				</div>

				<div className='overflow-hidden rounded-xl border bg-background'>
					<div className='hidden grid-cols-[170px_120px_minmax(180px,1fr)_190px_24px] gap-4 border-b bg-muted/35 px-5 py-3 text-sm font-medium text-muted-foreground md:grid'>
						<span>Sana</span><span>Mahsulotlar</span><span>Izoh</span><span className='text-right'>Jami</span><span />
					</div>
					{historyQuery.isLoading ? (
						<div className='flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground'><LoaderCircle className='size-5 animate-spin' /> Tarix yuklanmoqda</div>
					) : historyQuery.isError ? (
						<div className='p-8 text-center text-sm text-red-500'>Kirimlar tarixini yuklab bo‘lmadi.</div>
					) : historyQuery.data?.data?.length ? (
						<div className='divide-y'>
							{historyQuery.data.data.map(record => (
								<Link to={`/dashboard/imports/${record.id}`} key={record.id} className='group grid gap-2 px-5 py-4 text-sm transition-colors hover:bg-[#F5F7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6A81FF] dark:hover:bg-[#6A81FF]/10 md:grid-cols-[170px_120px_minmax(180px,1fr)_190px_24px] md:items-center md:gap-4'>
									<div><span className='mr-2 text-muted-foreground md:hidden'>Sana:</span>{formatDate(record.created_at)}</div>
									<div><span className='mr-2 text-muted-foreground md:hidden'>Mahsulotlar:</span>{record._count?.import_items ?? 0} tur</div>
									<div className='truncate text-muted-foreground'>{record.note || 'Izoh kiritilmagan'}</div>
									<div className='font-medium md:text-right'>{formatPrice(record.total_price)}</div>
									<ChevronRight className='hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 md:block' />
								</Link>
							))}
						</div>
					) : (
						<div className='flex h-36 flex-col items-center justify-center gap-2 text-sm text-muted-foreground'><CalendarDays className='size-6' /> Bu davrda kirim topilmadi</div>
					)}
				</div>
				<PaginationContyent currentPage={page} setCurrentPage={setPage} postsPerPage={limit} setPostPerPage={value => { setLimit(value); setPage(1) }} totalPosts={historyQuery.data?.total || 0} pagesSize={[10, 20, 50, 100]} />
			</section>
		</div>
	)
}

interface NumberFieldProps {
	value: string
	onChange: (value: string) => void
	ariaLabel: string
	currency?: 'UZS' | 'USD'
	decimal?: boolean
	changed?: boolean
}

function NumberField({ value, onChange, ariaLabel, currency, decimal = currency === 'USD', changed = false }: NumberFieldProps) {
	return (
		<div className='relative'>
			<Input
				aria-label={ariaLabel}
				inputMode={decimal ? 'decimal' : 'numeric'}
				value={value}
				onChange={event => onChange(event.target.value)}
				className={`h-10 text-sm ${currency ? 'pr-12' : ''} ${changed ? 'border-[#6A81FF] bg-[#F5F7FF] dark:bg-[#6A81FF]/10' : ''}`}
			/>
			{currency && <span aria-hidden='true' className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>{currency}</span>}
		</div>
	)
}


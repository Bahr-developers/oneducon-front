import type { InventoryMovement } from '@/@types/products'
import PaginationContyent from '@/components/_components/pagination'
import { DeleteConfirm } from '@/components/ui/alerd-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useQueryParams } from '@/hooks/query-params'
import { formatPrice } from '@/lib/utils'
import { productUtils } from '@/utils/products'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { LucideIcon } from 'lucide-react'
import {
	ArrowDownToLine,
	ArrowLeft,
	ArrowUpFromLine,
	Barcode,
	Boxes,
	CalendarClock,
	CircleAlert,
	DollarSign,
	History,
	Package,
	RefreshCw,
	Scale,
	Tag,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EditProduct from './edit-products'

function positiveInteger(value: string, fallback: number) {
	const parsed = Number(value)
	return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function movementPresentation(type: string) {
	switch (type.toUpperCase()) {
		case 'IMPORT':
			return { label: 'Kirim', incoming: true, className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300' }
		case 'ORDER':
		case 'SALE':
			return { label: 'Sotuv', incoming: false, className: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300' }
		case 'RETURN':
			return { label: 'Qaytarish', incoming: true, className: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300' }
		case 'ADJUSTMENT':
			return { label: 'Tuzatish', incoming: null, className: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300' }
		default:
			return { label: type || 'Noma’lum', incoming: null, className: 'bg-muted text-muted-foreground' }
	}
}

function formatMovementDate(value: string) {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '—'
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	return `${day}.${month}.${date.getFullYear()} · ${hours}:${minutes}`
}

export default function ProductDetailsPage() {
	const { id = '' } = useParams()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { getParam, updateURL } = useQueryParams()
	const [page, setPage] = useState(() => positiveInteger(getParam('page'), 1))
	const [limit, setLimit] = useState(() => positiveInteger(getParam('limit'), 20))

	useEffect(() => {
		updateURL({ page: String(page), limit: String(limit) })
	}, [page, limit, updateURL])

	const productQuery = useQuery({
		queryKey: ['product-details', id],
		queryFn: () => productUtils.getProductByID(id),
		enabled: Boolean(id),
	})
	const movementsQuery = useQuery({
		queryKey: ['product-inventory-movements', id, page, limit],
		queryFn: () => productUtils.getInventoryMovements({ id, page, limit }),
		enabled: Boolean(id),
	})

	const deleteProduct = useMutation({
		mutationFn: productUtils.deleteProduct,
		onSuccess: () => {
			toast.success("Mahsulot o‘chirildi")
			queryClient.invalidateQueries({ queryKey: ['get_all_products'] })
			navigate('/dashboard/products')
		},
		onError: () => toast.error("Mahsulotni o‘chirib bo‘lmadi"),
	})

	if (productQuery.isLoading) return <ProductDetailsSkeleton />

	const product = productQuery.data?.data
	if (productQuery.isError || !product) {
		return (
			<div className='mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center'>
				<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30'><Package className='size-6' /></div>
				<h1 className='text-xl font-medium'>Mahsulot topilmadi</h1>
				<p className='mt-2 text-sm text-muted-foreground'>Mahsulot o‘chirilgan yoki server bilan bog‘lanib bo‘lmadi.</p>
				<div className='mt-5 flex gap-2'>
					<Button variant='outline' asChild><Link to='/dashboard/products'><ArrowLeft /> Mahsulotlarga qaytish</Link></Button>
					<Button onClick={() => productQuery.refetch()}><RefreshCw /> Qayta urinish</Button>
				</div>
			</div>
		)
	}

	const stockIsLow = product.quantity <= product.reminder_quantity
	const movements = movementsQuery.data?.data ?? []

	return (
		<div className='mx-auto w-full max-w-[1500px] space-y-6 pb-8'>
			<header className='border-b pb-5'>
				<Link to='/dashboard/products' className='mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#536BE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A81FF]'>
					<ArrowLeft className='size-4' /> Mahsulotlarga qaytish
				</Link>
				<div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
					<div className='min-w-0'>
						<div className='mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
							<span className='font-medium text-[#536BE8]'>Mahsulot kartasi</span>
							<span aria-hidden='true'>/</span>
							<span>ID: {product.id}</span>
						</div>
						<h1 className='break-words text-2xl font-medium tracking-[-0.02em] sm:text-3xl'>{product.name}</h1>
						<p className='mt-2 flex items-center gap-2 text-sm text-muted-foreground'><Barcode className='size-4' /> {product.barcode || 'Shtrix-kod belgilanmagan'}</p>
					</div>
					<div className='flex flex-wrap gap-2'>
						<EditProduct product={product} showLabel />
						<DeleteConfirm title='O‘chirish' variant='outline' onConfirm={() => deleteProduct.mutate(product.id)} />
					</div>
				</div>
			</header>

			<section className='grid items-stretch gap-4 lg:grid-cols-[300px_minmax(0,1fr)]'>
				<div className='flex min-h-40 flex-col justify-between rounded-xl bg-[#18204A] p-5 text-white shadow-[0_16px_45px_rgba(25,36,92,0.16)]'>
					<div className='flex items-start justify-between'>
						<div><p className='text-sm text-white/60'>Ombordagi miqdor</p><p className='mt-2 text-4xl font-medium tracking-[-0.04em] tabular-nums'>{product.quantity}</p></div>
						<Boxes className='size-6 text-[#8FA0FF]' />
					</div>
					<div className='flex items-center justify-between gap-3 text-xs'>
						<span className={stockIsLow ? 'text-amber-300' : 'text-emerald-300'}>{stockIsLow ? 'Zaxira kam qolgan' : 'Zaxira yetarli'}</span>
						<span className='text-white/50'>Eslatma: {product.reminder_quantity}</span>
					</div>
				</div>

				<div className='grid overflow-hidden rounded-xl border bg-background sm:grid-cols-2 xl:grid-cols-4'>
					<InfoCell icon={DollarSign} label='Tannarx' value={formatPrice(product.cost_price)} />
					<InfoCell icon={Tag} label='Sotuv narxi' value={formatPrice(product.sale_price)} />
					<InfoCell icon={ArrowDownToLine} label='Ulgurji narx' value={product.wholesale_price === null ? 'Belgilanmagan' : formatPrice(product.wholesale_price)} />
					<InfoCell icon={Scale} label='O‘lchov / kategoriya' value={`${product.unit?.name || '—'} · ${product.category?.name || 'Kategoriyasiz'}`} />
				</div>
			</section>

			<section className='overflow-hidden rounded-xl border bg-background'>
				<div className='flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<h2 className='flex items-center gap-2 font-medium'><History className='size-5 text-[#6A81FF]' /> Ombor harakatlari</h2>
						<p className='mt-1 text-sm text-muted-foreground'>Kirim, sotuv va zaxira o‘zgarishlarining xronologiyasi.</p>
					</div>
					<span className='text-sm text-muted-foreground'>{movementsQuery.data?.total ?? 0} ta harakat</span>
				</div>

				{movementsQuery.isLoading ? (
					<div className='space-y-3 p-5'>{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className='h-11 w-full' />)}</div>
				) : movementsQuery.isError ? (
					<div className='flex min-h-44 flex-col items-center justify-center px-5 text-center'>
						<CircleAlert className='size-6 text-red-500' />
						<p className='mt-2 font-medium'>Harakatlarni yuklab bo‘lmadi</p>
						<Button variant='outline' size='sm' onClick={() => movementsQuery.refetch()} className='mt-3'><RefreshCw /> Qayta urinish</Button>
					</div>
				) : movements.length ? (
					<Table className='min-w-[900px]'>
						<TableHeader>
							<TableRow className='bg-muted/30 hover:bg-muted/30'>
								<TableHead className='px-5'>Sana</TableHead>
								<TableHead>Turi</TableHead>
								<TableHead className='text-right'>Miqdor</TableHead>
								<TableHead className='text-right'>Tannarx</TableHead>
								<TableHead>Manba</TableHead>
								<TableHead className='pr-5'>Izoh</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>{movements.map(movement => <MovementRow key={movement.id} movement={movement} />)}</TableBody>
					</Table>
				) : (
					<div className='flex min-h-44 flex-col items-center justify-center px-5 text-center'>
						<History className='size-7 text-muted-foreground' />
						<p className='mt-2 font-medium'>Ombor harakatlari hali mavjud emas</p>
						<p className='mt-1 text-sm text-muted-foreground'>Birinchi kirim yoki sotuvdan keyin tarix shu yerda ko‘rinadi.</p>
					</div>
				)}
			</section>

			<PaginationContyent
				currentPage={page}
				setCurrentPage={setPage}
				postsPerPage={limit}
				setPostPerPage={value => { setLimit(value); setPage(1) }}
				totalPosts={movementsQuery.data?.total ?? 0}
				pagesSize={[10, 20, 50, 100]}
			/>
		</div>
	)
}

function InfoCell({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
	return (
		<div className='flex min-h-24 flex-col justify-between border-b p-4 last:border-b-0 sm:min-h-32 sm:border-r sm:[&:nth-child(2)]:border-r-0 xl:border-b-0 xl:[&:nth-child(2)]:border-r xl:last:border-r-0'>
			<div className='flex items-center gap-2 text-sm text-muted-foreground'><Icon className='size-4 text-[#6A81FF]' /> {label}</div>
			<p className='mt-4 break-words font-medium tabular-nums'>{value}</p>
		</div>
	)
}

function MovementRow({ movement }: { movement: InventoryMovement }) {
	const presentation = movementPresentation(movement.type)
	const absoluteQuantity = Math.abs(movement.quantity)
	const quantity = presentation.incoming === true ? `+${absoluteQuantity}` : presentation.incoming === false ? `−${absoluteQuantity}` : String(movement.quantity)
	const note = movement.note || movement.import?.note || movement.order?.note || '—'
	const MovementIcon = presentation.incoming === false ? ArrowUpFromLine : presentation.incoming === true ? ArrowDownToLine : RefreshCw

	return (
		<TableRow>
			<TableCell className='px-5'><span className='flex items-center gap-2'><CalendarClock className='size-4 text-muted-foreground' /> {formatMovementDate(movement.created_at)}</span></TableCell>
			<TableCell><Badge variant='outline' className={presentation.className}><MovementIcon />{presentation.label}</Badge></TableCell>
			<TableCell className={`text-right font-medium tabular-nums ${presentation.incoming === false ? 'text-rose-600' : presentation.incoming === true ? 'text-emerald-600' : ''}`}>{quantity}</TableCell>
			<TableCell className='text-right tabular-nums'>{movement.cost_price === null ? '—' : formatPrice(movement.cost_price)}</TableCell>
			<TableCell>{movement.import_id ? <Link to={`/dashboard/imports/${movement.import_id}`} className='font-medium text-[#536BE8] hover:underline'>Kirim #{movement.import_id}</Link> : movement.order_id ? `Buyurtma #${movement.order?.order_number ?? movement.order_id}` : 'Qo‘lda o‘zgartirish'}</TableCell>
			<TableCell className='max-w-[280px] truncate pr-5 text-muted-foreground' title={note}>{note}</TableCell>
		</TableRow>
	)
}

function ProductDetailsSkeleton() {
	return (
		<div className='mx-auto w-full max-w-[1500px] space-y-6 pb-8'>
			<Skeleton className='h-28 w-full' />
			<div className='grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]'><Skeleton className='h-40' /><Skeleton className='h-40' /></div>
			<Skeleton className='h-80 w-full' />
		</div>
	)
}

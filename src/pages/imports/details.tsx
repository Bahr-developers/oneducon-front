import { Button } from '@/components/ui/button'
import { formatDate, formatPrice } from '@/lib/utils'
import { importUtils } from '@/utils/imports'
import { useQuery } from '@tanstack/react-query'
import {
	ArrowLeft,
	Box,
	CalendarClock,
	FileText,
	LoaderCircle,
	PackageCheck,
	RefreshCw,
	Warehouse,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export default function ImportDetailsPage() {
	const { id = '' } = useParams()
	const detailsQuery = useQuery({
		queryKey: ['import-details', id],
		queryFn: () => importUtils.getById(id),
		enabled: Boolean(id),
	})

	if (detailsQuery.isLoading) {
		return (
			<div className='flex min-h-[55vh] items-center justify-center gap-2 text-sm text-muted-foreground'>
				<LoaderCircle className='size-5 animate-spin text-[#6A81FF]' /> Kirim ma’lumotlari yuklanmoqda
			</div>
		)
	}

	if (detailsQuery.isError || !detailsQuery.data?.data) {
		return (
			<div className='mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center'>
				<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30'>
					<FileText className='size-6' />
				</div>
				<h1 className='text-xl font-medium'>Kirim ma’lumotlari topilmadi</h1>
				<p className='mt-2 text-sm text-muted-foreground'>Ma’lumot o‘chirilgan yoki server bilan bog‘lanib bo‘lmadi.</p>
				<div className='mt-5 flex gap-2'>
					<Button variant='outline' asChild><Link to='/dashboard/imports'><ArrowLeft /> Tarixga qaytish</Link></Button>
					<Button onClick={() => detailsQuery.refetch()}><RefreshCw /> Qayta urinish</Button>
				</div>
			</div>
		)
	}

	const details = detailsQuery.data.data
	const items = details.import_items ?? []
	const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)

	return (
		<div className='mx-auto w-full max-w-[1450px] space-y-6 pb-8'>
			<header className='border-b pb-5'>
				<Link to='/dashboard/imports' className='mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#536BE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A81FF]'>
					<ArrowLeft className='size-4' /> Kirimlar tarixiga qaytish
				</Link>
				<div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
					<div>
						<div className='mb-2 flex items-center gap-2 text-sm font-medium text-[#536BE8]'><PackageCheck className='size-4' /> Saqlangan kirim</div>
						<h1 className='text-2xl font-medium tracking-[-0.02em] sm:text-3xl'>Kirim #{details.id}</h1>
						<p className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'><CalendarClock className='size-4' /> {formatDate(details.created_at)}</p>
					</div>
					<div className='min-w-[260px] rounded-xl bg-[#18204A] px-5 py-4 text-white shadow-[0_14px_40px_rgba(25,36,92,0.16)]'>
						<p className='text-sm text-white/65'>Kirim qiymati</p>
						<p className='mt-1 text-2xl font-medium tracking-[-0.03em] tabular-nums'>{formatPrice(details.total_price)}</p>
					</div>
				</div>
			</header>

			<div className='grid gap-4 sm:grid-cols-3'>
				<Summary label='Mahsulot turi' value={`${items.length} tur`} icon={Box} />
				<Summary label='Jami birlik' value={`${totalUnits} dona`} icon={Warehouse} />
				<div className='rounded-xl border bg-background px-4 py-3 sm:col-span-1'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'><FileText className='size-4 text-[#6A81FF]' /> Izoh</div>
					<p className='mt-2 line-clamp-2 text-sm font-medium'>{details.note || 'Izoh kiritilmagan'}</p>
				</div>
			</div>

			<section className='overflow-hidden rounded-xl border bg-background'>
				<div className='flex items-center justify-between border-b bg-muted/30 px-5 py-3'>
					<h2 className='font-medium'>Partiyadagi mahsulotlar</h2>
					<span className='text-sm text-muted-foreground'>{items.length} qator</span>
				</div>
				<div className='overflow-x-auto'>
					<div className='min-w-[900px]'>
						<div className='grid grid-cols-[minmax(230px,1.5fr)_150px_120px_170px_180px_130px] gap-4 border-b bg-muted/20 px-5 py-3 text-xs font-medium text-muted-foreground'>
							<span>Mahsulot</span><span>Shtrix-kod</span><span className='text-right'>Kirim miqdori</span><span className='text-right'>Kirim tannarxi</span><span className='text-right'>Qator jami</span><span className='text-right'>Hozir omborda</span>
						</div>
						{items.length ? (
							<div className='divide-y'>
								{items.map((item, index) => (
									<div key={item.id} className='grid grid-cols-[minmax(230px,1.5fr)_150px_120px_170px_180px_130px] items-center gap-4 px-5 py-4 text-sm'>
										<div className='flex min-w-0 items-center gap-3'>
											<span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF1FF] text-xs font-medium text-[#536BE8] dark:bg-[#6A81FF]/15'>{index + 1}</span>
											<div className='min-w-0'><p className='truncate font-medium'>{item.product?.name || `Mahsulot #${item.product_id}`}</p><p className='mt-0.5 text-xs text-muted-foreground'>ID: {item.product_id}</p></div>
										</div>
										<span className='truncate text-muted-foreground'>{item.product?.barcode || '—'}</span>
										<span className='text-right font-medium tabular-nums'>+{item.quantity}</span>
										<span className='text-right tabular-nums'>{formatPrice(item.cost_price)}</span>
										<span className='text-right font-medium tabular-nums'>{formatPrice(item.total_price)}</span>
										<span className='text-right tabular-nums'>{item.product?.quantity ?? '—'}</span>
									</div>
								))}
							</div>
						) : (
							<div className='flex h-36 items-center justify-center text-sm text-muted-foreground'>Bu kirimda mahsulotlar mavjud emas.</div>
						)}
					</div>
				</div>
			</section>
		</div>
	)
}

function Summary({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Box }) {
	return (
		<div className='flex items-center gap-3 rounded-xl border bg-background px-4 py-3'>
			<div className='flex size-9 items-center justify-center rounded-lg bg-[#EEF1FF] text-[#536BE8] dark:bg-[#6A81FF]/15'><Icon className='size-4' /></div>
			<div><p className='text-xs text-muted-foreground'>{label}</p><p className='mt-0.5 font-medium'>{value}</p></div>
		</div>
	)
}

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
import { formatPrice } from '@/lib/utils'
import { orderUtils } from '@/utils/orders'
import { useQuery } from '@tanstack/react-query'
import {
	ArrowLeft,
	CalendarClock,
	CircleAlert,
	CreditCard,
	Package,
	Phone,
	ReceiptText,
	RefreshCw,
	ShoppingBag,
	User,
	WalletCards,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

function formatDateTime(value?: string) {
	if (!value) return 'Sana mavjud emas'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return 'Sana mavjud emas'
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	return `${day}.${month}.${date.getFullYear()} · ${hours}:${minutes}`
}

export default function SaleDetailsPage() {
	const { id = '' } = useParams()
	const orderQuery = useQuery({
		queryKey: ['order-details', id],
		queryFn: () => orderUtils.getOrderByID(id),
		enabled: Boolean(id),
	})

	if (orderQuery.isLoading) return <SaleDetailsSkeleton />

	const sale = orderQuery.data?.data
	if (orderQuery.isError || !sale) {
		return (
			<div className='mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center'>
				<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30'><ReceiptText className='size-6' /></div>
				<h1 className='text-xl font-medium'>Sotuv ma’lumotlari topilmadi</h1>
				<p className='mt-2 text-sm text-muted-foreground'>Buyurtma o‘chirilgan yoki server bilan bog‘lanib bo‘lmadi.</p>
				<div className='mt-5 flex gap-2'>
					<Button variant='outline' asChild><Link to='/dashboard/selers'><ArrowLeft /> Sotuvlarga qaytish</Link></Button>
					<Button onClick={() => orderQuery.refetch()}><RefreshCw /> Qayta urinish</Button>
				</div>
			</div>
		)
	}

	const totalPayments = sale.payments?.reduce((sum, payment) => sum + (payment.price || payment.amount || 0), 0) ?? 0
	const remainingDebt = Math.max(sale.total_price - totalPayments, 0)
	const totalUnits = sale.order_items?.reduce((sum, item) => sum + (item.count || item.quantity || 0), 0) ?? 0
	const isPaid = remainingDebt === 0

	return (
		<div className='mx-auto w-full max-w-[1500px] space-y-6 pb-8'>
			<header className='border-b pb-5'>
				<Link to='/dashboard/selers' className='mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#536BE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A81FF]'>
					<ArrowLeft className='size-4' /> Sotuvlarga qaytish
				</Link>
				<div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
					<div>
						<div className='mb-2 flex items-center gap-2 text-sm font-medium text-[#536BE8]'><ShoppingBag className='size-4' /> Sotuv cheki</div>
						<h1 className='text-2xl font-medium tracking-[-0.02em] sm:text-3xl'>Buyurtma #{sale.order_number || sale.id}</h1>
						<p className='mt-2 flex items-center gap-2 text-sm text-muted-foreground'><CalendarClock className='size-4' /> {formatDateTime(sale.created_at)}</p>
					</div>
					<Badge variant={isPaid ? 'default' : 'destructive'} className={isPaid ? 'bg-emerald-600 px-3 py-1 text-sm' : 'px-3 py-1 text-sm'}>{isPaid ? 'To‘liq to‘langan' : 'Qarz mavjud'}</Badge>
				</div>
			</header>

			<section className='grid gap-4 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,2.2fr)]'>
				<div className='rounded-xl bg-[#18204A] p-5 text-white shadow-[0_16px_45px_rgba(25,36,92,0.16)]'>
					<div className='flex items-start justify-between'><div><p className='text-sm text-white/60'>Sotuv summasi</p><p className='mt-2 text-2xl font-medium tracking-[-0.03em] tabular-nums'>{formatPrice(sale.total_price)}</p></div><ReceiptText className='size-6 text-[#8FA0FF]' /></div>
					<div className='mt-6 border-t border-white/10 pt-4 text-xs text-white/55'>{sale.order_items?.length ?? 0} tur · {totalUnits} birlik mahsulot</div>
				</div>

				<div className='grid overflow-hidden rounded-xl border bg-background sm:grid-cols-3'>
					<SummaryCell icon={CreditCard} label='To‘langan' value={formatPrice(totalPayments)} className='text-emerald-600' />
					<SummaryCell icon={WalletCards} label='Qolgan qarz' value={formatPrice(remainingDebt)} className={remainingDebt > 0 ? 'text-rose-600' : ''} />
					<SummaryCell icon={User} label='Xaridor' value={sale.client?.name || 'Noma’lum xaridor'} />
				</div>
			</section>

			{sale.client && (
				<section className='flex flex-col gap-3 rounded-xl border bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex items-center gap-3'><div className='flex size-10 items-center justify-center rounded-lg bg-[#EEF1FF] text-[#536BE8] dark:bg-[#6A81FF]/15'><User className='size-5' /></div><div><p className='text-xs text-muted-foreground'>Xaridor</p><p className='font-medium'>{sale.client.name}</p></div></div>
					{sale.client.phone && <a href={`tel:+${sale.client.phone}`} className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#536BE8]'><Phone className='size-4' /> +{sale.client.phone}</a>}
				</section>
			)}

			<section className='overflow-hidden rounded-xl border bg-background'>
				<div className='flex items-center justify-between border-b px-5 py-4'><div><h2 className='flex items-center gap-2 font-medium'><Package className='size-5 text-[#6A81FF]' /> Mahsulotlar</h2><p className='mt-1 text-sm text-muted-foreground'>Sotuv tarkibi, narx va chegirmalar.</p></div><span className='text-sm text-muted-foreground'>{sale.order_items?.length ?? 0} qator</span></div>
				{sale.order_items?.length ? (
					<Table className='min-w-[850px]'>
						<TableHeader><TableRow className='bg-muted/30 hover:bg-muted/30'><TableHead className='px-5'>Mahsulot</TableHead><TableHead className='text-right'>Miqdor</TableHead><TableHead className='text-right'>Narx</TableHead><TableHead className='text-right'>Chegirma</TableHead><TableHead className='pr-5 text-right'>Jami</TableHead></TableRow></TableHeader>
						<TableBody>
							{sale.order_items.map((item, index) => {
								const quantity = item.count || item.quantity || 0
								const discount = (item.discount || 0) * quantity
								const total = item.total ?? quantity * item.price - discount
								return (
									<TableRow key={item.id || index}>
										<TableCell className='px-5'><Link to={`/dashboard/products/${item.product_id || item.product?.id}`} className='font-medium hover:text-[#536BE8] hover:underline'>{item.product?.name || item.name || `Mahsulot #${index + 1}`}</Link></TableCell>
										<TableCell className='text-right tabular-nums'>{quantity}</TableCell>
										<TableCell className='text-right tabular-nums'>{formatPrice(item.price)}</TableCell>
										<TableCell className='text-right tabular-nums text-rose-600'>{discount > 0 ? `−${formatPrice(discount)}` : '—'}</TableCell>
										<TableCell className='pr-5 text-right font-medium tabular-nums'>{formatPrice(total)}</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				) : <div className='flex h-32 items-center justify-center text-sm text-muted-foreground'>Mahsulotlar mavjud emas.</div>}
			</section>

			<div className='grid gap-4 lg:grid-cols-2'>
				<section className='overflow-hidden rounded-xl border bg-background'>
					<div className='border-b px-5 py-4'><h2 className='flex items-center gap-2 font-medium'><CreditCard className='size-5 text-[#6A81FF]' /> To‘lovlar</h2></div>
					{sale.payments?.length ? <div className='divide-y'>{sale.payments.map((payment, index) => <div key={payment.id || index} className='flex items-center justify-between gap-4 px-5 py-4 text-sm'><div><p className='font-medium'>{payment.payment_type?.name || payment.payment_method || `To‘lov #${index + 1}`}</p>{payment.note && <p className='mt-1 text-xs text-muted-foreground'>{payment.note}</p>}</div><span className='font-medium tabular-nums text-emerald-600'>{formatPrice(payment.price || payment.amount || 0)}</span></div>)}</div> : <EmptyLine text='To‘lov mavjud emas' />}
				</section>

				<section className='overflow-hidden rounded-xl border bg-background'>
					<div className='border-b px-5 py-4'><h2 className='flex items-center gap-2 font-medium'><CircleAlert className='size-5 text-[#6A81FF]' /> Qarzlar</h2></div>
					{sale.debts?.length ? <div className='divide-y'>{sale.debts.map((debt, index) => <div key={debt.id || index} className='flex items-center justify-between gap-4 px-5 py-4 text-sm'><div><p className='font-medium'>Qarz #{index + 1}</p><p className='mt-1 text-xs text-muted-foreground'>{debt.reminder || 'Eslatma kiritilmagan'}</p></div><div className='text-right'><span className='font-medium tabular-nums text-rose-600'>{formatPrice(debt.price)}</span><p className='mt-1 text-xs text-muted-foreground'>{debt.status === 'UNPAID' ? 'To‘lanmagan' : 'To‘langan'}</p></div></div>)}</div> : <EmptyLine text='Qarz mavjud emas' />}
				</section>
			</div>
		</div>
	)
}

function SummaryCell({ icon: Icon, label, value, className = '' }: { icon: typeof CreditCard; label: string; value: string; className?: string }) {
	return <div className='flex min-h-28 flex-col justify-between border-b p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0'><div className='flex items-center gap-2 text-sm text-muted-foreground'><Icon className='size-4 text-[#6A81FF]' /> {label}</div><p className={`mt-4 break-words font-medium tabular-nums ${className}`}>{value}</p></div>
}

function EmptyLine({ text }: { text: string }) {
	return <div className='flex h-28 items-center justify-center text-sm text-muted-foreground'>{text}</div>
}

function SaleDetailsSkeleton() {
	return <div className='mx-auto w-full max-w-[1500px] space-y-6 pb-8'><Skeleton className='h-28 w-full' /><div className='grid gap-4 lg:grid-cols-2'><Skeleton className='h-40' /><Skeleton className='h-40' /></div><Skeleton className='h-72 w-full' /></div>
}

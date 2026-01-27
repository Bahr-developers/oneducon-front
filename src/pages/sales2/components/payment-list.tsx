import { Badge } from '@/components/ui/badge'
import { Payment } from '@/types/sales-type2'

function paymentTypeLabel(id: string) {
	// o‘zingda mapping bo‘lsa shu yerga qo‘yasan
	if (id === '1') return 'Naqd'
	if (id === '2') return 'Karta'
	if (id === '3') return 'Aralash / Boshqa'
	return `Turi #${id}`
}

export default function PaymentsList({ payments }: { payments: Payment[] }) {
	if (!payments?.length) {
		return <div className='text-sm text-muted-foreground'>Hali to‘lov yo‘q</div>
	}
	function formatUZS(value: number) {
		const s = Math.round(value).toString()
		const spaced = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
		return `${spaced} UZS`
	}

	return (
		<div className='space-y-2'>
			{payments.map(p => (
				<div
					key={p.id}
					className='flex items-center justify-between rounded-lg border p-2'
				>
					<div className='flex items-center gap-2'>
						<Badge variant='secondary'>
							{paymentTypeLabel(p.payment_type_id)}
						</Badge>
						<div className='text-xs text-muted-foreground'>ID: {p.id}</div>
					</div>
					<div className='font-semibold'>{formatUZS(p.price)}</div>
				</div>
			))}
		</div>
	)
}

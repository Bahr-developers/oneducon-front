import { CheckCircle2 } from 'lucide-react'
import { formatTimeOnly } from '@/lib/utils'
import { useDashboardCurrency } from '../hooks/use-dashboard-currency'
import { useLastTransactions } from '../hooks/use-last-transactions'
import { formatCompactMoney, toDisplayAmount } from '../lib/format'
import { DashboardEmpty, DashboardError } from './dashboard-states'
import { DashboardWidget } from './dashboard-widget'
import { ListSkeleton } from './skeletons/dashboard-skeletons'

export function LastTransactions() {
	const { currency } = useDashboardCurrency()
	const { data, isLoading, isError } = useLastTransactions()

	const items = data?.data ?? []

	return (
		<DashboardWidget title="So'nggi tranzaksiyalar">
			{isLoading ? (
				<ListSkeleton rows={6} />
			) : isError ? (
				<DashboardError />
			) : !items.length ? (
				<DashboardEmpty message="Tranzaksiyalar yo'q" />
			) : (
				<ul className='space-y-1.5'>
					{items.map(item => {
						const checkLabel = item.order_id
							? `Chek #${item.order_id.slice(-5)}`
							: `To'lov #${item.id.slice(-5)}`

						return (
							<li
								key={item.id}
								className='flex min-w-0 items-center gap-2 rounded-lg px-0.5 py-1 hover:bg-muted/40'
							>
								<span className='inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500'>
									<CheckCircle2 className='size-3.5' />
								</span>
								<div className='min-w-0 flex-1'>
									<p className='truncate text-[11px] font-medium'>
										{checkLabel}
									</p>
									<p className='truncate text-[10px] text-muted-foreground'>
										{formatTimeOnly(item.created_at)}
										{item.payment_type?.name
											? ` · ${item.payment_type.name}`
											: ''}
									</p>
								</div>
								<span className='shrink-0 text-[11px] font-semibold whitespace-nowrap'>
									{formatCompactMoney(
										toDisplayAmount(item.price, currency),
										currency,
									)}
								</span>
							</li>
						)
					})}
				</ul>
			)}
		</DashboardWidget>
	)
}

import { Package } from 'lucide-react'
import { useDashboardCurrency } from '../hooks/use-dashboard-currency'
import { useTopCategories } from '../hooks/use-top-categories'
import { formatCompactMoney, toDisplayAmount } from '../lib/format'
import { DashboardEmpty, DashboardError } from './dashboard-states'
import { DashboardWidget } from './dashboard-widget'
import { ListSkeleton } from './skeletons/dashboard-skeletons'

export function TopCategories() {
	const { currency } = useDashboardCurrency()
	const { data, isLoading, isError } = useTopCategories()

	const max = Math.max(...(data?.map(item => item.totalSoldPrice) ?? [1]), 1)

	return (
		<DashboardWidget title='Top kategoriyalar'>
			{isLoading ? (
				<ListSkeleton />
			) : isError ? (
				<DashboardError />
			) : !data?.length ? (
				<DashboardEmpty />
			) : (
				<ul className='space-y-2.5'>
					{data.map(category => {
						const width = Math.max((category.totalSoldPrice / max) * 100, 8)
						return (
							<li key={category.id} className='min-w-0 space-y-1'>
								<div className='flex items-center justify-between gap-2'>
									<span className='flex min-w-0 items-center gap-1.5'>
										<span
											className='inline-flex size-6 shrink-0 items-center justify-center rounded-md'
											style={{
												backgroundColor: `${category.color}1A`,
												color: category.color,
											}}
										>
											<Package className='size-3' />
										</span>
										<span className='truncate text-[11px] font-medium'>
											{category.name}
										</span>
									</span>
									<span className='shrink-0 text-[11px] font-semibold'>
										{formatCompactMoney(
											toDisplayAmount(category.totalSoldPrice, currency),
											currency,
										)}
									</span>
								</div>
								<div className='h-1.5 overflow-hidden rounded-full bg-muted'>
									<div
										className='h-full rounded-full transition-all'
										style={{
											width: `${width}%`,
											backgroundColor: category.color,
										}}
									/>
								</div>
							</li>
						)
					})}
				</ul>
			)}
		</DashboardWidget>
	)
}

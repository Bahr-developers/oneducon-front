import { Cell, Label, Pie, PieChart } from 'recharts'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart'
import { PAYMENT_CHART_COLORS } from '../constants/dashboard.mock'
import { useDashboardCurrency } from '../hooks/use-dashboard-currency'
import { usePaymentStats } from '../hooks/use-payment-stats'
import { formatCompactMoney, toDisplayAmount } from '../lib/format'
import { DashboardEmpty, DashboardError } from './dashboard-states'
import { DashboardWidget } from './dashboard-widget'
import { WidgetSkeleton } from './skeletons/dashboard-skeletons'

const chartConfig = {
	total_price: { label: "To'lov" },
} satisfies ChartConfig

export function PaymentTypesChart() {
	const { currency } = useDashboardCurrency()
	const { data, isLoading, isError } = usePaymentStats()

	const chartData =
		data?.map((item, index) => ({
			id: item.payment_type_id,
			name: item.payment_type_name,
			value: toDisplayAmount(item.total_price, currency),
			fill: PAYMENT_CHART_COLORS[index % PAYMENT_CHART_COLORS.length],
		})) ?? []

	const total = chartData.reduce((sum, item) => sum + item.value, 0)

	return (
		<DashboardWidget title="Sotuv turlari bo'yicha">
			{isLoading ? (
				<WidgetSkeleton className='border-0 p-0 shadow-none' />
			) : isError ? (
				<DashboardError />
			) : !chartData.length ? (
				<DashboardEmpty />
			) : (
				<div className='flex min-w-0 flex-col items-center gap-3'>
					<ChartContainer
						config={chartConfig}
						className='mx-auto aspect-square h-[130px] w-[130px]'
					>
						<PieChart>
							<ChartTooltip
								content={
									<ChartTooltipContent
										formatter={value =>
											formatCompactMoney(Number(value), currency)
										}
										nameKey='name'
									/>
								}
							/>
							<Pie
								data={chartData}
								dataKey='value'
								nameKey='name'
								innerRadius={36}
								outerRadius={52}
								strokeWidth={1}
							>
								{chartData.map(item => (
									<Cell key={item.id} fill={item.fill} />
								))}
								<Label
									content={({ viewBox }) => {
										if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
											return (
												<text
													x={viewBox.cx}
													y={viewBox.cy}
													textAnchor='middle'
													dominantBaseline='middle'
												>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy ?? 0) - 5}
														className='fill-muted-foreground text-[9px]'
													>
														Jami
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy ?? 0) + 8}
														className='fill-foreground text-[10px] font-bold'
													>
														{formatCompactMoney(total, currency)}
													</tspan>
												</text>
											)
										}
										return null
									}}
								/>
							</Pie>
						</PieChart>
					</ChartContainer>

					<ul className='w-full min-w-0 space-y-1.5'>
						{chartData.map(item => {
							const percent = total
								? ((item.value / total) * 100).toFixed(1)
								: '0.0'
							return (
								<li
									key={item.id}
									className='flex min-w-0 items-center justify-between gap-2 text-[11px]'
								>
									<span className='flex min-w-0 items-center gap-1.5 text-muted-foreground'>
										<span
											className='size-2 shrink-0 rounded-full'
											style={{ backgroundColor: item.fill }}
										/>
										<span className='truncate'>{item.name}</span>
									</span>
									<span className='shrink-0 text-right font-medium text-foreground'>
										{percent}%
									</span>
								</li>
							)
						})}
					</ul>
				</div>
			)}
		</DashboardWidget>
	)
}

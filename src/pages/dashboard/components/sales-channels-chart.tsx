import { Cell, Label, Pie, PieChart } from 'recharts'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SALES_CHANNELS_MOCK } from '../constants/dashboard.mock'
import { useDashboardCurrency } from '../hooks/use-dashboard-currency'
import { formatCompactMoney, toDisplayAmount } from '../lib/format'
import { DashboardWidget } from './dashboard-widget'

const chartConfig = {
	value: { label: 'Savdo' },
} satisfies ChartConfig

export function SalesChannelsChart() {
	const { currency } = useDashboardCurrency()
	const chartData = SALES_CHANNELS_MOCK.map(item => ({
		...item,
		value: toDisplayAmount(item.value, currency),
	}))
	const total = chartData.reduce((sum, item) => sum + item.value, 0)

	return (
		<DashboardWidget
			title="Sotuvlar kanallar bo'yicha"
			action={
				<Link
					to='/dashboard/orders'
					className='inline-flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-[#5C59E8] hover:underline'
				>
					Hisobot
					<ArrowRight className='size-3' />
				</Link>
			}
		>
			<div className='flex min-w-0 flex-col items-center gap-3'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square h-[140px] w-[140px]'
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
							innerRadius={38}
							outerRadius={56}
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
													y={(viewBox.cy ?? 0) - 6}
													className='fill-muted-foreground text-[9px]'
												>
													Jami
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy ?? 0) + 8}
													className='fill-foreground text-[11px] font-bold'
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
					{SALES_CHANNELS_MOCK.map(item => (
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
							<span className='shrink-0 font-medium text-foreground'>
								{item.percent}%
							</span>
						</li>
					))}
				</ul>
			</div>
		</DashboardWidget>
	)
}

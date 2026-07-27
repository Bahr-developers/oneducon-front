import { useState } from 'react'
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from 'recharts'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SalesDynamicsPeriod } from '@/@types/dash-stats'
import {
	DASHBOARD_ACCENT,
	SALES_DYNAMICS_MONTH,
	SALES_DYNAMICS_WEEK,
	SALES_DYNAMICS_YEAR,
} from '../constants/dashboard.mock'
import { useDashboardCurrency } from '../hooks/use-dashboard-currency'
import { formatCompactMoney, toDisplayAmount } from '../lib/format'
import { DashboardWidget } from './dashboard-widget'

const PERIOD_DATA = {
	week: SALES_DYNAMICS_WEEK,
	month: SALES_DYNAMICS_MONTH,
	year: SALES_DYNAMICS_YEAR,
} as const

const chartConfig = {
	current: {
		label: '2025',
		color: DASHBOARD_ACCENT,
	},
	previous: {
		label: '2024',
		color: '#CBD5E1',
	},
} satisfies ChartConfig

export function SalesDynamicsChart() {
	const [period, setPeriod] = useState<SalesDynamicsPeriod>('month')
	const { currency } = useDashboardCurrency()
	const data = PERIOD_DATA[period].map(point => ({
		...point,
		current: toDisplayAmount(point.current, currency),
		previous: toDisplayAmount(point.previous, currency),
	}))

	return (
		<DashboardWidget
			title='Sotuvlar dinamikasi'
			action={
				<Tabs
					value={period}
					onValueChange={value => setPeriod(value as SalesDynamicsPeriod)}
				>
					<TabsList className='h-7 rounded-md p-0.5'>
						<TabsTrigger value='week' className='h-6 rounded px-2 text-[11px]'>
							Hafta
						</TabsTrigger>
						<TabsTrigger value='month' className='h-6 rounded px-2 text-[11px]'>
							Oy
						</TabsTrigger>
						<TabsTrigger value='year' className='h-6 rounded px-2 text-[11px]'>
							Yil
						</TabsTrigger>
					</TabsList>
				</Tabs>
			}
		>
			<ChartContainer
				config={chartConfig}
				className='aspect-auto h-[200px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]'
			>
				<LineChart
					data={data}
					margin={{ left: 0, right: 8, top: 4, bottom: 0 }}
				>
					<CartesianGrid vertical={false} strokeDasharray='3 3' />
					<XAxis
						dataKey='label'
						tickLine={false}
						axisLine={false}
						tickMargin={6}
						fontSize={10}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						width={40}
						fontSize={10}
						tickFormatter={value => {
							const n = Number(value)
							if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
							if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}K`
							return String(n)
						}}
					/>
					<ChartTooltip
						content={
							<ChartTooltipContent
								formatter={value => formatCompactMoney(Number(value), currency)}
							/>
						}
					/>
					<Legend
						verticalAlign='top'
						align='right'
						iconType='circle'
						iconSize={8}
						wrapperStyle={{ fontSize: 11, paddingBottom: 4 }}
					/>
					<Line
						type='monotone'
						dataKey='previous'
						stroke='var(--color-previous)'
						strokeWidth={1.5}
						dot={false}
						name='2024'
					/>
					<Line
						type='monotone'
						dataKey='current'
						stroke='var(--color-current)'
						strokeWidth={2}
						dot={{ r: 2.5, fill: DASHBOARD_ACCENT }}
						activeDot={{ r: 4 }}
						name='2025'
					/>
				</LineChart>
			</ChartContainer>
		</DashboardWidget>
	)
}

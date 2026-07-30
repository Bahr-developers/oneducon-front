import { Banknote, ShoppingBag, TrendingUp, Wallet } from 'lucide-react'
import { STAT_TRENDS } from '../constants/dashboard.mock'
import { useDashboardCurrency } from '../hooks/use-dashboard-currency'
import { useGeneralStats } from '../hooks/use-general-stats'
import { DashboardError } from './dashboard-states'
import { StatsCardsSkeleton } from './skeletons/dashboard-skeletons'
import { StatCard } from './stat-card'

export function StatisticsCards() {
	const { isUsd, currency } = useDashboardCurrency()
	const { data, isLoading, isError } = useGeneralStats()

	if (isLoading) return <StatsCardsSkeleton />
	if (isError) return <DashboardError />

	const sales = isUsd
		? (data?.totalSalePricesUsd ?? 0)
		: (data?.totalSalePrices ?? 0)
	const expense = isUsd
		? (data?.totalCostPricesUsd ?? 0)
		: (data?.totalCostPrices ?? 0)
	const profit = sales - expense
	// const returns = isUsd ? MOCK_RETURNS_USD : MOCK_RETURNS_UZS
	const cash = data?.cashOnHand ?? 0

	return (
		<div className='grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4'>
			<StatCard
				title='Jami savdo'
				value={sales}
				currency={currency}
				icon={ShoppingBag}
				tone='purple'
				trendPercent={STAT_TRENDS.sales}
			/>
			<StatCard
				title='Jami xarajat'
				value={expense}
				currency={currency}
				icon={Banknote}
				tone='blue'
				trendPercent={STAT_TRENDS.expense}
			/>
			<StatCard
				title='Sof foyda'
				value={profit}
				currency={currency}
				icon={TrendingUp}
				tone='green'
				trendPercent={STAT_TRENDS.profit}
			/>
			{/* <StatCard
				title='Qaytarishlar'
				value={returns}
				currency={currency}
				icon={Undo2}
				tone='red'
				trendPercent={STAT_TRENDS.returns}
			/> */}
			<StatCard
				title='Kassadagi pul'
				value={cash}
				currency='UZS'
				icon={Wallet}
				tone='orange'
				footerLabel='Bugungi holat'
			/>
		</div>
	)
}

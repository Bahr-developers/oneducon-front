import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Loader from '@/components/_components/loader'
import { USDRateDialog } from '@/components/_components/usd-rate-worning'
import { storeUtils } from '@/utils/store'
import { BranchSalesTable } from './components/branch-sales-table'
import { DashboardHeader } from './components/dashboard-header'
import { LastTransactions } from './components/last-transactions'
import { PaymentTypesChart } from './components/payment-types-chart'
import { SalesChannelsChart } from './components/sales-channels-chart'
import { SalesDynamicsChart } from './components/sales-dynamics-chart'
import { StatisticsCards } from './components/statistics-cards'
import { TopCategories } from './components/top-categories'
import { TopProducts } from './components/top-products'
import { DashboardCurrencyProvider } from './hooks/use-dashboard-currency'

const DashboardMain = () => {
	const storeId = localStorage.getItem('storeId') || '1'
	const { data: store, isLoading } = useQuery({
		queryKey: ['get_store'],
		queryFn: () => storeUtils.getStoreByID(storeId),
		staleTime: 5 * 60 * 1000,
	})
	const [productData, setProductData] = useState(store?.data)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	useEffect(() => {
		if (store?.data) {
			setProductData(store.data)
		}
	}, [store?.data])

	useEffect(() => {
		if (store?.data && !store.data.usd_rate) {
			const timer = setTimeout(() => {
				setIsDialogOpen(true)
			}, 1000)

			return () => clearTimeout(timer)
		}
	}, [store?.data])

	if (isLoading) {
		return <Loader />
	}

	return (
		<DashboardCurrencyProvider>
			<div className='w-full space-y-3 pb-4'>
				<DashboardHeader />
				<StatisticsCards />

				<div className='grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-12'>
					<div className='min-w-0 lg:col-span-2 xl:col-span-6'>
						<SalesDynamicsChart />
					</div>
					<div className='min-w-0 xl:col-span-3'>
						<SalesChannelsChart />
					</div>
					<div className='min-w-0 xl:col-span-3'>
						<BranchSalesTable />
					</div>
				</div>

				<div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4'>
					<TopCategories />
					<TopProducts />
					<LastTransactions />
					<PaymentTypesChart />
				</div>

				<USDRateDialog
					data={productData || {}}
					isOpen={isDialogOpen}
					onClose={() => setIsDialogOpen(false)}
				/>
			</div>
		</DashboardCurrencyProvider>
	)
}

export default DashboardMain

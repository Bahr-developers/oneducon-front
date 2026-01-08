import { orderUtils } from '@/utils/orders'
import { useQuery } from '@tanstack/react-query'

const StatisticsSales = () => {
	const { data: stats } = useQuery<{
		totalOrders: number
		totalPayments: number
		totalDebts: number
	}>({
		queryKey: ['stats'],
		queryFn: orderUtils.getOrderStats,
	})

	const data = [
		{
			id: 1,
			name: 'Jami sotuvlar',
			summa: stats?.totalOrders,
			valyute: 'UZS',
		},
		{
			id: 2,
			name: 'Jami to`langan summa',
			summa: stats?.totalPayments,
			valyute: 'UZS',
		},
		{ id: 3, name: 'Jami qarz', summa: stats?.totalDebts, valyute: 'UZS' },
	]
	return (
		<div className='flex justify-between items-center w-full gap-4 mt-2'>
			{data.map(el => (
				<div className='w-full border p-4 rounded-xl' key={el.id}>
					<h4>{el.name}</h4>
					<p className='text-3xl font-medium mt-3'>
						{el.summa?.toLocaleString()} {el.valyute}
					</p>
				</div>
			))}
		</div>
	)
}

export default StatisticsSales

import { orderUtils } from '@/utils/orders'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const StatisticsSales = () => {
	const [searchParams] = useSearchParams()
	const from = searchParams.get('from') || undefined
	const to = searchParams.get('to') || undefined

	const backendFrom = useMemo(() => {
		if (!from) return undefined
		const d = new Date(from)
		d.setHours(0, 0, 0, 0)
		return d
	}, [from])

	const backendTo = useMemo(() => {
		if (!to) return undefined
		const d = new Date(to)
		d.setHours(0, 0, 0, 0)
		d.setDate(d.getDate() + 1)
		return d
	}, [to])

	const { data: stats } = useQuery<{
		totalOrders: number
		totalPayments: number
		totalDebts: number
	}>({
		queryKey: ['stats', backendFrom?.toISOString(), backendTo?.toISOString()],
		queryFn: () =>
			orderUtils.getOrdersStats({
				from: backendFrom?.toISOString(),
				to: backendTo?.toISOString(),
			}),
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

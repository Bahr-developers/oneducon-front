import { useState } from 'react'
import { storeUtils } from '@/utils/store'
import { useQuery } from '@tanstack/react-query'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const Statistics = () => {
	const [isUsd, setIsUsd] = useState(false)

	const { data, isLoading } = useQuery({
		queryKey: ['storeStats'],
		queryFn: storeUtils.getStats,
	})

	// Ma'lumotlarni shakllantirish
	const statsList = [
		{
			title: 'Jami tan narx',
			value: isUsd ? data?.totalCostPricesUsd : data?.totalCostPrices,
			currency: isUsd ? '$' : 'UZS',
		},
		{
			title: 'Jami sotuv narx',
			value: isUsd ? data?.totalSalePricesUsd : data?.totalSalePrices,
			currency: isUsd ? '$' : 'UZS',
		},
		{
			title: "Jami to'lovlar",
			value: data?.totalPayments || 0,
			currency: 'UZS',
		},
		{
			title: 'Qarzlar',
			value: data?.totalDebts || 0,
			currency: 'UZS',
		},
	]

	if (isLoading) return <div>Yuklanmoqda...</div>

	return (
		<div className='w-full mt-4'>
			<div className='flex items-center justify-end space-x-2 mb-6'>
				<Label htmlFor='currency-mode' className='text-sm font-medium'>
					UZS
				</Label>
				<Switch id='currency-mode' checked={isUsd} onCheckedChange={setIsUsd} />
				<Label htmlFor='currency-mode' className='text-sm font-medium'>
					USD
				</Label>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				{statsList.map((el, index) => (
					<div
						className='w-full border p-5 rounded-xl bg-card shadow-sm'
						key={index}
					>
						<h4 className='text-muted-foreground text-sm font-medium'>
							{el?.title}
						</h4>
						<div className='flex items-baseline gap-x-2 mt-3'>
							<span className='text-2xl font-bold tracking-tight'>
								{el?.value?.toLocaleString(undefined, {
									minimumFractionDigits: isUsd ? 2 : 0,
									maximumFractionDigits: isUsd ? 2 : 0,
								})}
							</span>
							<span className='text-sm font-semibold text-muted-foreground'>
								{el?.currency}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Statistics

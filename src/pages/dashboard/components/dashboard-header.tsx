import { cn } from '@/lib/utils'
import { DashboardDateFilter } from './dashboard-date-filter'
import { useDashboardCurrency } from '../hooks/use-dashboard-currency'
import type { DashboardCurrency } from '@/@types/dash-stats'

export function DashboardHeader() {
	const { currency, setCurrency } = useDashboardCurrency()

	return (
		<div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between'>
			<div className='min-w-0'>
				<h1 className='text-xl font-medium tracking-tight text-foreground'>
					Asosiy panel
				</h1>
				<p className='mt-0.5 text-xs text-muted-foreground'>
					Do&apos;koningiz faoliyati haqida umumiy ma&apos;lumot
				</p>
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<DashboardDateFilter />
				<CurrencyToggle value={currency} onChange={setCurrency} />
			</div>
		</div>
	)
}

function CurrencyToggle({
	value,
	onChange,
}: {
	value: DashboardCurrency
	onChange: (value: DashboardCurrency) => void
}) {
	return (
		<div className='inline-flex h-8 items-center rounded-full border bg-card p-0.5 shadow-sm'>
			{(['UZS', 'USD'] as const).map(option => (
				<button
					key={option}
					type='button'
					onClick={() => onChange(option)}
					className={cn(
						'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
						value === option
							? 'bg-[#5C59E8] text-white'
							: 'text-muted-foreground hover:text-foreground',
					)}
				>
					{option}
				</button>
			))}
		</div>
	)
}

import { DateRangeFields } from '@/components/functions/date-range-fields'
import { CalendarRange } from 'lucide-react'

interface FilterExpensesProps {
	to: Date | undefined
	from: Date | undefined
	setFrom: (value: Date | undefined) => void
	setTo: (value: Date | undefined) => void
}

const FilterExpenses = ({ from, to, setFrom, setTo }: FilterExpensesProps) => {
	return (
		<div className='flex flex-col gap-3 rounded-xl border bg-background p-3 sm:flex-row sm:items-end sm:justify-between'>
			<div className='flex items-center gap-2 text-sm font-medium'>
				<div className='flex size-9 items-center justify-center rounded-lg bg-[#EEF1FF] text-[#536BE8] dark:bg-[#6A81FF]/15'><CalendarRange className='size-4' /></div>
				<div><p>Sana oralig‘i</p><p className='text-xs font-normal text-muted-foreground'>Xarajatlarni davr bo‘yicha ko‘ring</p></div>
			</div>
			<DateRangeFields from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
		</div>
	)
}

export default FilterExpenses

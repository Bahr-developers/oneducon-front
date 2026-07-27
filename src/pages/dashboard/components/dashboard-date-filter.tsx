import DatePickerSingle from '@/components/functions/DatePicerSingle'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { useDashboardDate } from '../hooks/use-dashboard-date'

export function DashboardDateFilter() {
	const { fromDate, toDate, setFrom, setTo } = useDashboardDate()

	const label =
		fromDate && toDate
			? `${format(fromDate, 'dd.MM.yyyy')} - ${format(toDate, 'dd.MM.yyyy')}`
			: 'Sana tanlang'

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className='h-8 gap-1.5 rounded-lg border-border bg-card px-2.5 text-xs font-normal shadow-sm'
				>
					<CalendarIcon className='size-3.5 text-muted-foreground' />
					<span>{label}</span>
					<ChevronDown className='size-3.5 text-muted-foreground' />
				</Button>
			</PopoverTrigger>
			<PopoverContent align='end' className='w-auto space-y-3 p-3'>
				<div className='space-y-1'>
					<p className='text-[11px] font-medium text-muted-foreground'>Dan</p>
					<DatePickerSingle value={fromDate} onChange={setFrom} />
				</div>
				<div className='space-y-1'>
					<p className='text-[11px] font-medium text-muted-foreground'>Gacha</p>
					<DatePickerSingle value={toDate} onChange={setTo} />
				</div>
			</PopoverContent>
		</Popover>
	)
}

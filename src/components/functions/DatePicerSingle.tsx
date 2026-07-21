import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
	value: Date | undefined
	onChange: (date: Date | undefined) => void
}

const DatePickerSingle = ({ value, onChange }: DatePickerProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					className='w-[170px] justify-start text-left font-normal'
					variant='outline'
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{value && format(value, 'dd.MM.yyyy')}
				</Button>
			</PopoverTrigger>

			<PopoverContent className='w-auto p-0'>
				<Calendar selected={value} mode='single' onSelect={onChange} />
			</PopoverContent>
		</Popover>
	)
}

export default DatePickerSingle

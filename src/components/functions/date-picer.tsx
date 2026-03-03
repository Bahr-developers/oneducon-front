import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

interface DatePickerProps {
	title: string
	startTitle: string
	date: Date | undefined
	setDate: (date: Date | undefined) => void
	className?: string
	open?: boolean
	onOpenChange?: (open: boolean) => void
	portalContainer?: HTMLElement | null
}

export function DatePicker({
	date,
	setDate,
	title,
	startTitle,
	className,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	portalContainer,
}: DatePickerProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
	const open = controlledOpen ?? uncontrolledOpen
	const setOpen = controlledOnOpenChange ?? setUncontrolledOpen

	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate)
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<div className='flex flex-col w-full'>
				<p className='block w-full text-end'>{title}</p>
				<PopoverTrigger asChild>
					<Button
						type='button'
						variant={'outline'}
						className={cn(
							'h-12 w-full justify-start text-left font-normal',
							className,
							!date && 'text-muted-foreground bg-transparent',
						)}
					>
						<CalendarIcon />
						{date ? format(date, 'PPP') : <span>{startTitle}</span>}
					</Button>
				</PopoverTrigger>

				<PopoverContent
					container={portalContainer}
					className='z-[60] w-auto p-0'
					align='start'
					onCloseAutoFocus={e => e.preventDefault()}
					onOpenAutoFocus={e => e.preventDefault()}
				>
					<Calendar mode='single' selected={date} onSelect={handleDateSelect} />
				</PopoverContent>
			</div>
		</Popover>
	)
}

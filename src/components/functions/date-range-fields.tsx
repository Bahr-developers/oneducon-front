import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { uz } from 'date-fns/locale'
import { CalendarIcon, X } from 'lucide-react'
import { useState } from 'react'

interface DateRangeFieldsProps {
	from: Date | undefined
	to: Date | undefined
	onFromChange: (date: Date | undefined) => void
	onToChange: (date: Date | undefined) => void
	className?: string
}

function formatDisplayDate(date: Date) {
	return [
		String(date.getDate()).padStart(2, '0'),
		String(date.getMonth() + 1).padStart(2, '0'),
		date.getFullYear(),
	].join('.')
}

function dayValue(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function DateField({
	label,
	placeholder,
	value,
	onChange,
	disabled,
}: {
	label: string
	placeholder: string
	value: Date | undefined
	onChange: (date: Date | undefined) => void
	disabled?: (date: Date) => boolean
}) {
	const [open, setOpen] = useState(false)

	return (
		<div className='min-w-0'>
			<span className='mb-1.5 block text-xs text-muted-foreground'>{label}</span>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						type='button'
						variant='outline'
						aria-label={`${label} sanasini tanlash`}
						className={cn('h-10 w-full justify-start bg-background px-3 text-left font-normal sm:w-[170px]', !value && 'text-muted-foreground')}
					>
						<CalendarIcon className='text-[#6A81FF]' />
						{value ? formatDisplayDate(value) : placeholder}
					</Button>
				</PopoverTrigger>
				<PopoverContent align='end' className='w-auto p-0'>
					<Calendar
						mode='single'
						locale={uz}
						weekStartsOn={1}
						selected={value}
						onSelect={date => {
							onChange(date)
							if (date) setOpen(false)
						}}
						disabled={disabled}
						defaultMonth={value}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}

export function DateRangeFields({ from, to, onFromChange, onToChange, className }: DateRangeFieldsProps) {
	const hasValue = Boolean(from || to)

	return (
		<div className={cn('flex flex-col gap-2 sm:flex-row sm:items-end', className)}>
			<DateField
				label='Dan'
				placeholder='Boshlanish sanasi'
				value={from}
				onChange={date => {
					onFromChange(date)
					if (date && to && dayValue(date) > dayValue(to)) onToChange(undefined)
				}}
				disabled={date => Boolean(to && dayValue(date) > dayValue(to))}
			/>
			<DateField
				label='Gacha'
				placeholder='Tugash sanasi'
				value={to}
				onChange={onToChange}
				disabled={date => Boolean(from && dayValue(date) < dayValue(from))}
			/>
			{hasValue && (
				<Button
					type='button'
					variant='ghost'
					onClick={() => {
						onFromChange(undefined)
						onToChange(undefined)
					}}
					className='h-10 text-muted-foreground hover:text-foreground'
				>
					<X /> Tozalash
				</Button>
			)}
		</div>
	)
}

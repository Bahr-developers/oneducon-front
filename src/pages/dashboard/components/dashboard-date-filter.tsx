import DatePickerSingle from '@/components/functions/DatePicerSingle'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { format, startOfMonth } from 'date-fns'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDashboardDate } from '../hooks/use-dashboard-date'

type DateMode = 'monthly' | 'all'

export function DashboardDateFilter() {
	const {
		fromDate,
		toDate,
		setFrom,
		setTo,
	} = useDashboardDate()

	const [mode, setMode] = useState<DateMode>('all')
	const [createdAt, setCreatedAt] = useState<Date | null>(null)

	useEffect(() => {
		const storedCreatedAt = localStorage.getItem('created_at')

		if (!storedCreatedAt) return

		const date = new Date(storedCreatedAt)

		if (Number.isNaN(date.getTime())) return

		setCreatedAt(date)

		// Birinchi ochilganda "Umumiy" bo'ladi
		setFrom(date)
	}, [])

	/**
	 * Rejim almashtirish
	 */
	const handleModeChange = (nextMode: DateMode) => {
		if (nextMode === mode) return

		/**
		 * UMUMIY
		 *
		 * from = created_at
		 */
		if (nextMode === 'all') {
			if (!createdAt) return

			setMode('all')
			setFrom(createdAt)

			return
		}

		/**
		 * OYLIK
		 *
		 * from = joriy oyning 1-sanasi
		 */
		if (nextMode === 'monthly') {
			const monthlyDate = startOfMonth(new Date())

			setMode('monthly')
			setFrom(monthlyDate)
		}
	}

	const handleFromChange = (date?: Date) => {
		if (!date) return

		setFrom(date)
	}

	const label =
		fromDate && toDate
			? `${format(fromDate, 'dd.MM.yyyy')} - ${format(toDate, 'dd.MM.yyyy')}`
			: 'Sana tanlang'

	return (
		<div className='flex items-center gap-1'>
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

				<PopoverContent
					align='end'
					className='w-auto space-y-3 p-3'
				>
					{/* Oylik / Umumiy */}
					<div className='flex rounded-lg border bg-muted/40 p-1'>
						<Button
							type='button'
							variant={mode === 'monthly' ? 'default' : 'ghost'}
							size='sm'
							className='h-7 flex-1 rounded-md text-xs'
							onClick={() => handleModeChange('monthly')}
						>
							Oylik
						</Button>

						<Button
							type='button'
							variant={mode === 'all' ? 'default' : 'ghost'}
							size='sm'
							className='h-7 flex-1 rounded-md text-xs'
							onClick={() => handleModeChange('all')}
						>
							Umumiy
						</Button>
					</div>

					{/* Dan */}
					<div className='space-y-1'>
						<p className='text-[11px] font-medium text-muted-foreground'>
							Dan
						</p>

						<DatePickerSingle
							value={fromDate}
							onChange={handleFromChange}
						/>
					</div>

					{/* Gacha */}
					<div className='space-y-1'>
						<p className='text-[11px] font-medium text-muted-foreground'>
							Gacha
						</p>

						<DatePickerSingle
							value={toDate}
							onChange={setTo}
						/>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
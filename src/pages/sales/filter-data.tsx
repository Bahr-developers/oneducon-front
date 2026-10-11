import type { client, paymentType } from '@/@types'
import { DateRangeFields } from '@/components/functions/date-range-fields'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { customerUtils } from '@/utils/customer'
import { paymentUtils } from '@/utils/payment-type'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'

interface PropsFilter {
	setFrom: (date: Date | undefined) => void
	setTo: (date: Date | undefined) => void
	to: Date | undefined
	from: Date | undefined
	client: string
	setClient: (value: string) => void
	paymentType: string
	setPaymentType: (value: string) => void
	hasActiveFilter: boolean
	onClear: () => void
	searchQuery: string
	setSearchQuery: (value: string) => void
}

const FilterData = ({
	from,
	setFrom,
	setTo,
	to,
	client,
	setClient,
	paymentType,
	setPaymentType,
	hasActiveFilter,
	onClear,
	searchQuery,
	setSearchQuery,
}: PropsFilter) => {
	const { data: customers } = useQuery<{ data: client[] }>({
		queryKey: ['customers'],
		queryFn: customerUtils.getCustomerAll,
	})

	const { data: paymentTypes } = useQuery<{ data: paymentType[] }>({
		queryKey: ['get_payment'],
		queryFn: paymentUtils.getPayments,
	})

	return (
		<div className='grid grid-cols-1 items-end gap-3 sm:grid-cols-2 xl:flex xl:flex-nowrap'>
			<div className='min-w-0 space-y-1.5 sm:col-span-2 xl:col-auto xl:min-w-[240px] xl:flex-[1.4]'>
				<label htmlFor='sales-search' className='block text-xs text-muted-foreground'>Qidirish</label>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input id='sales-search' type='search' placeholder='Buyurtma yoki xaridor...' className='h-11 bg-background pl-10' value={searchQuery} onChange={event => setSearchQuery(event.target.value)} />
				</div>
			</div>

			<div className='min-w-0 space-y-1.5 xl:w-[170px] xl:shrink-0'>
				<label className='block text-xs text-muted-foreground'>Xaridor</label>
				<Select value={client || 'all'} onValueChange={value => setClient(value === 'all' ? '' : value)}>
					<SelectTrigger className='h-11 w-full data-[size=default]:h-11'><SelectValue placeholder='Barcha xaridorlar' /></SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Barcha xaridorlar</SelectItem>
						{customers?.data?.map(item => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
					</SelectContent>
				</Select>
			</div>

			<div className='min-w-0 space-y-1.5 xl:w-[170px] xl:shrink-0'>
				<label className='block text-xs text-muted-foreground'>To‘lov turi</label>
				<Select value={paymentType || 'all'} onValueChange={value => setPaymentType(value === 'all' ? '' : value)}>
					<SelectTrigger className='h-11 w-full data-[size=default]:h-11'><SelectValue placeholder='Barcha to‘lovlar' /></SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Barcha to‘lovlar</SelectItem>
						{paymentTypes?.data?.map(type => <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>)}
					</SelectContent>
				</Select>
			</div>

			<DateRangeFields
				from={from}
				to={to}
				onFromChange={setFrom}
				onToChange={setTo}
				showClear={false}
				fromPlaceholder='Sana tanlang'
				toPlaceholder='Sana tanlang'
				className='sm:col-span-2 sm:[&>div]:flex-1 sm:[&_button]:w-full xl:col-auto xl:w-[312px] xl:shrink-0 xl:[&>div]:w-[152px]'
			/>

			{hasActiveFilter && (
				<Button type='button' variant='outline' onClick={onClear} className='h-11 sm:col-span-2 xl:col-auto xl:shrink-0'>
					<X /> Tozalash
				</Button>
			)}
		</div>
	)
}

export default FilterData

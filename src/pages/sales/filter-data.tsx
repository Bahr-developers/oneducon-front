import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { client, paymentType } from '@/@types'
import { customerUtils } from '@/utils/customer'
import { paymentUtils } from '@/utils/payment-type'
import { useQuery } from '@tanstack/react-query'
import { ListFilter } from 'lucide-react'
import { useMemo, useState } from 'react'

interface PropsFilter {
	setFrom: (date: Date | undefined) => void
	setTo: (date: Date | undefined) => void
	to: Date | undefined
	from: Date | undefined
	client: string
	setClient: (value: string) => void
	paymentType: string
	setPaymentType: (value: string) => void
}

const toInputDateValue = (date?: Date) => {
	if (!date) return ''
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

const fromInputDateValue = (value: string): Date | undefined => {
	if (!value) return undefined
	const [year, month, day] = value.split('-').map(Number)
	return new Date(year, month - 1, day)
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
}: PropsFilter) => {
	const [open, setOpen] = useState(false)

	const { data: customers } = useQuery<{ data: client[] }>({
		queryKey: ['customers'],
		queryFn: customerUtils.getCustomerAll,
	})

	const { data: paymentTypes } = useQuery<{ data: paymentType[] }>({
		queryKey: ['get_payment'],
		queryFn: paymentUtils.getPayments,
	})

	const hasActiveFilter = useMemo(() => {
		return !!from || !!to || !!client || !!paymentType
	}, [from, to, client, paymentType])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='flex items-center gap-x-2'>
					Filter
					<ListFilter size={18} />
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-[520px]'>
				<DialogHeader>
					<DialogTitle>Filter</DialogTitle>
					<DialogDescription>
						Ma&apos;lumotlarni xaridor, to&apos;lov turi va vaqt bo&apos;yicha
						filterlang
					</DialogDescription>
				</DialogHeader>

				<div className='w-full flex flex-col gap-y-4 py-4'>
					<div className='flex items-center w-full justify-between gap-x-4'>
						<div className='w-full space-y-1'>
							<span className='text-sm font-medium'>Xaridor</span>
							<Select
								value={client || undefined}
								onValueChange={value => setClient(value)}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Xaridor' />
								</SelectTrigger>
								<SelectContent className='z-[70]'>
									<SelectItem value='all'>Barchasi</SelectItem>
									{customers?.data?.map(item => (
										<SelectItem key={item.id} value={String(item.id)}>
											{item.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className='w-full space-y-1'>
							<span className='text-sm font-medium'>To&apos;lov turi</span>
							<Select
								value={paymentType || undefined}
								onValueChange={value => setPaymentType(value)}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder="To'lov turi" />
								</SelectTrigger>
								<SelectContent className='z-[70]'>
									<SelectItem value='all'>Barchasi</SelectItem>
									{paymentTypes?.data?.map(type => (
										<SelectItem key={type.id} value={String(type.id)}>
											{type.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div className='space-y-1'>
							<span className='text-sm font-medium'>Boshlanish sanasi</span>
							<Input
								type='date'
								value={toInputDateValue(from)}
								onChange={e => setFrom(fromInputDateValue(e.target.value))}
							/>
						</div>

						<div className='space-y-1'>
							<span className='text-sm font-medium'>Tugash sanasi</span>
							<Input
								type='date'
								value={toInputDateValue(to)}
								onChange={e => setTo(fromInputDateValue(e.target.value))}
							/>
						</div>
					</div>

					<div className='flex justify-end gap-2 pt-2'>
						<Button
							variant='outline'
							onClick={() => {
								setClient('')
								setPaymentType('')
								setFrom(undefined)
								setTo(undefined)
							}}
							className={hasActiveFilter ? '' : 'hidden'}
						>
							Tozalash
						</Button>

						<Button onClick={() => setOpen(false)}>Yopish</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default FilterData

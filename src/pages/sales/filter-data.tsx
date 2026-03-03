import { DatePicker } from '@/components/functions/date-picer'
import { Button } from '@/components/ui/button'
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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface propsFilter {
	setFrom: (date: Date | undefined) => void
	setTo: (date: Date | undefined) => void
	to: Date | undefined
	from: Date | undefined
	setClient: (value: string) => void
	setPaymentType: (value: string) => void
	onApply: () => void
}

const FilterData = ({
	from,
	setFrom,
	setTo,
	to,
	setClient,
	setPaymentType,
	onApply,
}: propsFilter) => {
	const { i18n } = useTranslation()
	const [open, setOpen] = useState(false)
	const { data: customers } = useQuery<{ data: client[] }>({
		queryKey: ['customers'],
		queryFn: customerUtils.getCustomerAll,
	})
	const { data: paymentTypes } = useQuery<{ data: paymentType[] }>({
		queryKey: ['get_payment'],
		queryFn: paymentUtils.getPayments,
	})

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<button className='flex items-center gap-x-2 cursor-pointer outline-none'>
					Filter
					<ListFilter size={20} />
				</button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Filter</DialogTitle>
					<DialogDescription>
						Ma'lumotlarni xaridor, to'lov turi va vaqt bo'yicha filterlang
					</DialogDescription>
				</DialogHeader>

				{/* Inputlar DialogHeader'dan tashqarida bo'lishi yaxshiroq */}
				<div className='w-full flex flex-col gap-y-4 py-4'>
					<div className='flex items-center w-full justify-between gap-x-4'>
						<div className='w-full space-y-1'>
							<span className='text-sm font-medium'>Xaridor</span>
							<Select onValueChange={value => setClient(value)}>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Xaridor' />
								</SelectTrigger>
								<SelectContent className='z-[70]'>
									{customers?.data?.map(client => (
										<SelectItem key={client.id} value={client.id}>
											{client.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className='w-full space-y-1'>
							<span className='text-sm font-medium'>To'lov turi</span>
							<Select onValueChange={value => setPaymentType(value)}>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder="To'lov turi" />
								</SelectTrigger>
								<SelectContent className='z-[70]'>
									{paymentTypes?.data?.map(type => (
										<SelectItem key={type.id} value={type.id}>
											{type.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='flex items-center gap-2 w-full'>
						<DatePicker
							date={from}
							setDate={d => {
								setFrom(d)
							}}
							title={i18n.language == 'uz' ? 'dan' : 'от'}
							startTitle={
								i18n.language == 'uz' ? 'Boshlang`ich sana' : 'Дата начала'
							}
						/>
						<DatePicker
							date={to}
							setDate={setTo}
							title={i18n.language == 'uz' ? 'gacha' : 'до'}
							startTitle={
								i18n.language == 'uz' ? 'Tugash sanasi' : 'Дата окончания'
							}
						/>
					</div>

					<Button
						onClick={() => {
							onApply()
							setOpen(false)
						}}
						className='w-full mt-2'
					>
						Filterlash
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default FilterData

// DebtsItem.tsx
import { Input } from '@/components/ui/input'
import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectTotals, setDebt } from '@/store/order-slice'
import { useTranslation } from 'react-i18next'
import { DatePicker } from '@/components/functions/date-picer'
import { useQuery } from '@tanstack/react-query'
import { customerUtils } from '@/utils/customer'
import UniversalSearchSelect from '@/components/_components/search-select'
import { client } from '@/types'
import CreateCustomer from '../customers/create-cus'
import { User, Calendar, WalletCards, MessageSquare } from 'lucide-react'

interface DebtModalProps {
	open: boolean
	returnTime: Date | undefined
	setReturnTime: (date: Date | undefined) => void
	selectedUser: client | null
	setSelectedUser: (user: client | null) => void
	reminder: string
	setReminder: (value: string) => void
}

const DebtsItem = ({
	open,
	returnTime,
	setReturnTime,
	selectedUser,
	setSelectedUser,
	setReminder,
	reminder,
}: DebtModalProps) => {
	const dispatch = useAppDispatch()
	const totals = useAppSelector(selectTotals)
	const { i18n } = useTranslation()
	const { totalItemsAmount, totalPaidAmount, remainingDebt } = totals

	const updateDebt = useCallback(() => {
		if (open && remainingDebt > 0) {
			dispatch(
				setDebt({
					price: remainingDebt,
					return_time: returnTime?.toISOString() || '',
					reminder: reminder,
					client_id: Number(selectedUser?.id),
				}),
			)
		}
	}, [dispatch, open, remainingDebt, returnTime, reminder, selectedUser])

	useEffect(() => {
		updateDebt()
	}, [updateDebt, totalItemsAmount, totalPaidAmount, remainingDebt])

	const handleReminderChange = (value: string) => {
		setReminder(value)
	}

	const { data: customers } = useQuery<{ data: client[] }>({
		queryKey: ['customers'],
		queryFn: customerUtils.getCustomerAll,
	})
	useEffect(() => {
		if (open && remainingDebt > 0 && !returnTime) {
			const defaultDate = new Date()
			defaultDate.setDate(defaultDate.getDate() + 3) // +3 kun
			setReturnTime(defaultDate)
		}
	}, [open, remainingDebt, returnTime, setReturnTime])

	return (
		<div className='flex flex-col gap-4 w-full mt-3'>
			{/* 1. SUMMARY SECTION (Ixcham karta ko'rinishida) */}
			<div className='bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-3'>
				{/* Jami Summa */}
				<div className='flex justify-between items-center text-sm'>
					<span className='text-muted-foreground flex items-center gap-2'>
						<WalletCards className='w-4 h-4' />
						Umumiy xarid:
					</span>
					<span className='font-bold text-base'>
						{totalItemsAmount.toLocaleString()}{' '}
						<span className='text-xs font-normal text-muted-foreground'>
							UZS
						</span>
					</span>
				</div>

				{/* To'langan Summa */}
				<div className='flex justify-between items-center text-sm mt-3'>
					<span className='text-muted-foreground'>To'landi:</span>
					<span className='font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded'>
						{totalPaidAmount > 0 ? '+' : ''}
						{totalPaidAmount.toLocaleString()}{' '}
						<span className='text-xs font-normal opacity-70'>UZS</span>
					</span>
				</div>

				{/* Ajratuvchi chiziq (faqat qarz bo'lsa) */}
				{remainingDebt > 0 && (
					<div className='border-t border-dashed my-1'></div>
				)}

				{/* Qarz Summasi (Faqat qarz bo'lsa ko'rinadi) */}
				{remainingDebt > 0 && (
					<div className='flex justify-between items-center'>
						<span className='text-destructive font-semibold flex items-center gap-1'>
							⚠️ Qarz miqdori:
						</span>
						<span className='font-bold text-xl text-destructive'>
							{remainingDebt.toLocaleString()}{' '}
							<span className='text-sm font-medium'>UZS</span>
						</span>
					</div>
				)}
			</div>

			{/* 2. DEBT FORM SECTION (Faqat qarz bo'lganda chiqadi) */}
			{open && remainingDebt > 0 && (
				<div className='flex flex-col gap-4 p-4 border border-destructive/30 bg-destructive/5 dark:bg-destructive/10 rounded-xl animate-in fade-in slide-in-from-top-2'>
					<div className='flex items-center gap-2 pb-2 border-b border-destructive/10'>
						<h4 className='font-semibold text-destructive text-sm uppercase tracking-wider'>
							Qarzni rasmiylashtirish
						</h4>
					</div>

					{/* Mijozni tanlash */}
					<div className='space-y-1.5'>
						<label className='text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1'>
							<User className='w-3.5 h-3.5' /> Mijoz
						</label>
						<div className='flex items-center gap-2'>
							<div className='flex-1'>
								<UniversalSearchSelect
									data={customers?.data || []}
									searchKey={['name', 'phone']}
									displayKey='name'
									secondaryKey='phone'
									value={selectedUser}
									onSelect={setSelectedUser}
									placeholder='Mijozni qidiring...'
									className='w-full bg-background h-10'
								/>
							</div>
							<CreateCustomer />
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
						<div className='space-y-1.5'>
							<label className='text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1'>
								<Calendar className='w-3.5 h-3.5' /> Qaytarish vaqti
							</label>
							<div className='bg-background rounded-md border overflow-hidden'>
								<DatePicker
									className='w-full border-none shadow-none text-sm'
									date={returnTime}
									setDate={setReturnTime}
									title={i18n.language == 'uz' ? '' : ''}
									startTitle={''}
								/>
							</div>
						</div>

						<div className='space-y-1.5'>
							<label className='text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1'>
								<MessageSquare className='w-3.5 h-3.5' /> Eslatma
							</label>
							<Input
								placeholder='Izoh yozing...'
								value={reminder}
								onChange={e => handleReminderChange(e.target.value)}
								className='bg-background h-10'
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default DebtsItem

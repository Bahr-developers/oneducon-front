import { Button } from '@/components/ui/button'
import OrderItem from './order-item'
import PaymentItem from './payment-item'
import DebtsItem from './debts-item'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	addPayment,
	selectOrderItems,
	selectPayments,
	selectTotals,
	selectDebt,
	resetOrder,
	addProductToOrder,
} from '@/store/order-slice'
import emptyImage from '@/assets/images/empty-box.png'
import { useMutation, useQuery } from '@tanstack/react-query'
import { paymentUtils } from '@/utils/payment-type'
import { orderUtils } from '@/utils/orders'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { client, product } from '@/types'
import UniversalSearchSelect from '@/components/_components/search-select'
import CreateCustomer from '../customers/create-cus'
import { customerUtils } from '@/utils/customer'
import SearchSelect from './search-select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function OrderProducts() {
	const dispatch = useAppDispatch()
	const items = useAppSelector(selectOrderItems)
	const payments = useAppSelector(selectPayments)
	const { hasDebt, remainingDebt } = useAppSelector(selectTotals)
	const debt = useAppSelector(selectDebt)
	const [returnTime, setReturnTime] = useState<Date | undefined>()
	const [selectedUser, setSelectedUser] = useState<client | null>(null)
	const storeId = localStorage.getItem('storeId') || 1
	const [reminder, setReminder] = useState('')
	const [isActive, setIsActive] = useState<boolean>(false)
	const { data: paymentTypes } = useQuery({
		queryKey: ['get_payment'],
		queryFn: paymentUtils.getPayments,
	})

	const newPayments = payments?.map(el => {
		return {
			payment_type_id: el.payment_type_id,
			price: el.price,
		}
	})
	const handleToggle = (checked: boolean) => {
		setIsActive(checked)
		console.log('Yangi qiymat:', checked)
	}
	const disabledProductIds = items.map(i => i.product_id)
	const handleAddPayment = () => {
		dispatch(addPayment())
	}

	const createOrder = useMutation({
		mutationFn: orderUtils.postOrder,
		onSuccess: () => {
			toast.success('Order yaratildi ')
			dispatch(resetOrder())
			setSelectedUser(null)
			setReturnTime(undefined)
			setReminder('')
		},
		onError: err => {
			const error = err as AxiosError<{ message: string }>
			toast(error?.response?.data?.message || 'Something went wrong')
			console.log(err)
		},
	})

	const handleSubmit = () => {
		const orderData = {
			store_id: +storeId,
			client_id: debt?.client_id || Number(selectedUser?.id) || null,
			items: items
				.filter(item => item.product !== null)
				.map(item => ({
					product_id: item.product_id,
					count: item.count,
					discount: Number(item.discount),
					price: item.price,
				})),
			payments: newPayments
				?.filter(p => p?.payment_type_id && p?.price > 0)
				?.map(p => ({
					payment_type_id: Number(p?.payment_type_id),
					price: p.price,
				})),
			debts: debt && debt.price > 0 && remainingDebt > 0 ? [debt] : [],
		}

		createOrder.mutate(orderData)
	}

	const { data: customers } = useQuery({
		queryKey: ['customers'],
		queryFn: customerUtils.getCustomerAll,
	})

	const handleReset = () => {
		dispatch(resetOrder())
		setSelectedUser(null)
		setReturnTime(undefined)
		setReminder('')
	}
	const handleAddProduct = (product: product) => {
		dispatch(addProductToOrder(product))
	}
	const allPaymentsValid =
		payments.length > 0 && payments.every(p => p.payment_type_id && p.price > 0)

	return (
		<div className=''>
			{/* <h2 className='text-xl font-medium my-3'>Buyurtma berish</h2> */}
			<div className='w-full flex items-start gap-4 '>
				<div className='order-products w-[65%]  sticky top-20  pb-10'>
					<div className='w-full flex flex-col items-start mb-4'>
						<SearchSelect
							key={items.length}
							onSelect={handleAddProduct}
							disabledProductIds={disabledProductIds}
						/>
					</div>
					<div className='w-full px-5 my-5 rounded-lg border p-3 h-[80vh] overflow-y-auto'>
						<div className='w-full'>
							<div className='flex justify-between items-center mb-5'>
								<h3 className='text-xl'>Mahsulotlar</h3>
								<div className='flex items-center space-x-2'></div>
								<Button
									className='w-[20%]'
									variant='outline'
									onClick={handleReset}
								>
									Tozalash
								</Button>
							</div>
							{items?.length === 0 ? (
								''
							) : (
								<div className='flex items-center justify-end space-x-2 my-2'>
									<Switch
										id='airplane-mode'
										checked={isActive}
										onCheckedChange={handleToggle}
									/>
									<Label htmlFor='airplane-mode'>Tan narxi</Label>
								</div>
							)}
							<div className='flex flex-col justify-center items-center space-y-3'>
								{items?.length === 0 ? (
									<p className='text-center text-gray-500 py-4'>
										<img
											className='mx-auto'
											width={300}
											height={300}
											src={emptyImage}
											alt='emty messages'
										/>
										Mahsulot qo'shilmagan. Yuqoridagi qidiruv orqali qo'shing.
									</p>
								) : (
									items.map(item => (
										<OrderItem
											key={item.id}
											item={item}
											constPrice={isActive}
										/>
									))
								)}
							</div>
						</div>
					</div>
				</div>
				<div className='flex-1 flex flex-col gap-5 w-[25%]'>
					<div className='p-2 border rounded-lg mb-1'>
						{!hasDebt && (
							<div className='flex text-[14px] flex-col space-y-1 items-start mt-2 w-full'>
								<h3>Mijozni belgilash(ixtiyoriy)</h3>
								<div className='flex justify-between items-center gap-x-3 w-full'>
									<UniversalSearchSelect
										data={customers?.data}
										searchKey={['name', 'phone']}
										displayKey='name'
										secondaryKey='phone'
										value={selectedUser}
										onSelect={setSelectedUser}
										placeholder='User nomini kiriting...'
										className='w-[80%]'
									/>
									<CreateCustomer />
								</div>
							</div>
						)}

						<DebtsItem
							open={hasDebt}
							returnTime={returnTime}
							setReturnTime={setReturnTime}
							selectedUser={selectedUser}
							setSelectedUser={setSelectedUser}
							reminder={reminder}
							setReminder={setReminder}
						/>

						{hasDebt && (
							<div className='mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg'>
								<p className='text-sm text-yellow-800 dark:text-yellow-200'>
									⚠️ Diqqat: {remainingDebt?.toLocaleString()} UZS qarz
									qolmoqda. Qaytarish vaqtini belgilashni unutmang!
								</p>
							</div>
						)}
					</div>

					<div className='flex flex-col gap-4 p-2 border rounded-lg mb-2'>
						<h3 className='text-[17px] font-semibold px-2'>To'lovlar</h3>
						{payments?.length === 0 ? (
							<p className='text-center text-gray-500 py-2'>
								To'lov qo'shilmagan
							</p>
						) : (
							payments?.map((payment, index) => (
								<PaymentItem
									key={index}
									index={index}
									payment={payment}
									paymentTypes={paymentTypes?.data}
								/>
							))
						)}

						<Button
							variant='secondary'
							onClick={handleAddPayment}
							className='mx-auto border w-[200px] my-3'
						>
							+ To'lov qo'shish
						</Button>
					</div>

					<Button
						onClick={handleSubmit}
						className='w-full h-10 mx-auto block bg-[#6A81FF] text-white hover:bg-[#5b6fdc] cursor-pointer'
						disabled={
							items?.length === 0 ||
							items.every(i => !i.product) ||
							!allPaymentsValid ||
							(hasDebt && (!selectedUser || !returnTime)) ||
							createOrder.isPending
						}
					>
						{createOrder.isPending ? (
							<span className='flex items-center gap-2'>
								<span className='animate-spin'>⏳</span>
								Saqlanmoqda...
							</span>
						) : (
							'Buyurtmani saqlash'
						)}
					</Button>
				</div>
			</div>
		</div>
	)
}

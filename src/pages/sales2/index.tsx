/**
 * COMPLETE ORDER SYSTEM WITH REDUX STORE
 *
 * Bu fayl barcha komponentlarni birlashtiradi va to'liq ishlaydi
 */

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	addOrderItem,
	selectOrderItems,
	resetOrder,
	setProductToItem,
	addPayment,
	selectPayments,
	selectTotals,
} from '@/store/order-slice'
import { useState } from 'react'
import { product } from '@/types'
import SearchSelect from './search-select-new'
import OrderItemRow from './order'

export default function CompleteOrderPage() {
	const dispatch = useAppDispatch()
	const items = useAppSelector(selectOrderItems)
	const payments = useAppSelector(selectPayments)
	const totals = useAppSelector(selectTotals)

	const [topSearch, setTopSearch] = useState('')
	const [searchOpen, setSearchOpen] = useState(false)

	// Tanlangan mahsulotlar soni
	const itemCount = items.filter(i => i.product !== null).length

	const handleReset = () => {
		dispatch(resetOrder())
		setTopSearch('')
	}

	const handleProductSelect = (selectedProduct: product) => {
		// Agar bo'sh item bo'lsa, unga mahsulot biriktirish
		const emptyItem = items.find(i => i.product === null)

		if (emptyItem) {
			dispatch(
				setProductToItem({
					id: emptyItem.id,
					product: selectedProduct,
				}),
			)
		} else {
			// Aks holda yangi item qo'shish
			const newItemId = crypto.randomUUID()
			dispatch(addOrderItem())

			setTimeout(() => {
				dispatch(
					setProductToItem({
						id: newItemId,
						product: selectedProduct,
					}),
				)
			}, 50)
		}

		setTopSearch('')
		setSearchOpen(false)
	}

	const handleAddPayment = () => {
		dispatch(addPayment())
	}

	const formatPrice = (price: number) => {
		return price.toLocaleString()
	}

	return (
		<div className='min-h-screen bg-black'>
			<div className='max-w-7xl mx-auto'>
				<div className='grid gap-2 lg:grid-cols-[1fr_420px]'>
					{/* LEFT PANEL - Products */}
					<div className='rounded-xl border border-[#2a2a2a] bg-[#0a0a0a]'>
						{/* Top Search */}
						<div className='p-4 border-b border-[#2a2a2a]'>
							<SearchSelect
								value={topSearch}
								onChange={(v: string) => {
									setTopSearch(v)
									setSearchOpen(!!v.trim())
								}}
								open={searchOpen}
								onClose={() => setSearchOpen(false)}
								onSelect={handleProductSelect}
							/>
						</div>

						{/* Header */}
						<div className='border-b border-[#2a2a2a] p-4'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-3'>
									<h2 className='text-white text-2xl font-semibold'>
										Korzinka
									</h2>
									<Badge
										variant='secondary'
										className='bg-[#2a2a2a] text-white border-none'
									>
										{itemCount}
									</Badge>
								</div>
								<Button
									variant='outline'
									onClick={handleReset}
									className='border-[#2a2a2a] text-white hover:bg-[#2a2a2a]'
								>
									Tozalash
								</Button>
							</div>
						</div>

						{/* Items List */}
						<div className='p-4 space-y-4'>
							{items?.length === 0 || items.every(i => !i.product) ? (
								<div className='h-[520px] rounded-xl border border-[#2a2a2a] flex items-center justify-center text-center'>
									<div>
										<div className='text-white text-lg font-semibold'>
											Korzinka hozircha bo'sh
										</div>
										<div className='mt-1 text-[#888] text-sm'>
											Tepadan qidirib mahsulot qo'shing
										</div>
									</div>
								</div>
							) : (
								<>
									{items
										.filter(i => i.product !== null)
										.map(item => (
											<OrderItemRow key={item.id} item={item} />
										))}
								</>
							)}
						</div>
					</div>

					{/* RIGHT PANEL - Summary */}
					<div className='space-y-4'>
						{/* Summary Card */}
						<div className='rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-5'>
							<h3 className='text-white text-xl font-semibold mb-4'>
								Hisob-kitob
							</h3>

							<div className='space-y-3'>
								<div className='flex justify-between items-center'>
									<span className='text-[#888]'>Jami</span>
									<span className='text-white font-semibold text-lg'>
										{formatPrice(totals.totalItemsAmount)} UZS
									</span>
								</div>

								<div className='flex justify-between items-center'>
									<span className='text-[#888]'>To'langan</span>
									<span className='text-white font-semibold text-lg'>
										{formatPrice(totals.totalPaidAmount)} UZS
									</span>
								</div>

								<div className='border-t border-[#2a2a2a] pt-3'>
									<div className='flex justify-between items-center'>
										<span className='text-[#888]'>Qoldiq</span>
										<span
											className={`font-bold text-xl ${
												totals.remainingDebt > 0
													? 'text-red-500'
													: 'text-green-500'
											}`}
										>
											{formatPrice(totals.remainingDebt)} UZS
										</span>
									</div>
								</div>
							</div>

							<Button
								className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white h-12'
								disabled={itemCount === 0}
							>
								To'lash
							</Button>
						</div>

						{/* Payments Info */}
						{payments.length > 0 && (
							<div className='rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-5'>
								<h3 className='text-white text-lg font-semibold mb-3'>
									To'lovlar
								</h3>
								<div className='space-y-2'>
									{payments.map((payment, idx) => (
										<div
											key={idx}
											className='flex justify-between items-center text-sm'
										>
											<span className='text-[#888]'>To'lov {idx + 1}</span>
											<span className='text-white font-medium'>
												{formatPrice(payment.price)} UZS
											</span>
										</div>
									))}
								</div>
								<Button
									className='w-full mt-3 bg-[#2a2a2a] hover:bg-[#333] text-white'
									onClick={handleAddPayment}
								>
									+ To'lov qo'shish
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

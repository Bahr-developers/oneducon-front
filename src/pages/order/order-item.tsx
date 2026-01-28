import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import SearchSelect from './search-select'
import NumberInput from '@/components/_components/number-input'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	updateOrderItem,
	removeOrderItem,
	setProductToItem,
	selectOrderItems,
} from '@/store/order-slice'
import { product } from '@/types'

interface OrderItemProps {
	item: {
		id: string
		product: product | null
		count: number
		discount: number
		price: number
	}
	constPrice: boolean
}

const OrderItem = ({ item, constPrice }: OrderItemProps) => {
	const dispatch = useAppDispatch()
	const allItems = useAppSelector(selectOrderItems)

	// Tanlangan mahsulotlar ID larini olish (joriy itemdan tashqari)
	const disabledProductIds = allItems
		.filter(i => i.id !== item.id && i.product !== null)
		.map(i => Number(i.product?.id))

	const handleSelectProduct = (product: product) => {
		dispatch(setProductToItem({ id: item.id, product }))
	}

	const handleCountChange = (value: string) => {
		if (value === '') {
			dispatch(updateOrderItem({ id: item.id, updates: { count: 0 } }))
			return
		}

		let num = Number(value)
		if (isNaN(num)) return

		// Faqat MAX qiymatni tekshiramiz (yozayotganda)
		if (item.product?.quantity && num > item.product.quantity) {
			num = item.product.quantity
		}

		dispatch(
			updateOrderItem({
				id: item.id,
				updates: { count: num },
			}),
		)
	}

	const handleBlur = () => {
		if (!item.count || item.count < 1) {
			dispatch(
				updateOrderItem({
					id: item.id,
					updates: { count: 1 },
				}),
			)
		}
	}
	const handleDiscountChange = (val: { raw: number }) => {
		const discountValue = val?.raw ?? 0
		const numericDiscount = Number(discountValue)

		dispatch(
			updateOrderItem({
				id: item.id,
				updates: { discount: isNaN(numericDiscount) ? 0 : numericDiscount },
			}),
		)
	}

	const handleRemove = () => {
		dispatch(removeOrderItem(item.id))
	}

	const totalPrice = item.product
		? (item.price - item.discount) * item.count
		: 0

	return (
		<div className='w-full border rounded-lg p-3 flex flex-wrap gap-3 bg-[#f0f0f0] dark:bg-[#2d2d2d] items-center pb-10'>
			<div className='w-full flex justify-end py-2 border-b'>
				<Button
					className='cursor-pointer'
					variant='destructive'
					onClick={handleRemove}
				>
					<Trash2 />
				</Button>
			</div>

			<label>
				<span className='my-1 block'>Mahsulot *</span>
				<SearchSelect
					onSelect={handleSelectProduct}
					selectedProduct={item.product}
					disabledProductIds={disabledProductIds}
				/>
			</label>
			{constPrice && (
				<>
					<label className='w-52'>
						<span className='my-1 block'>Tan narxi(UZS)</span>
						<NumberInput
							className='w-full h-12'
							placeholder='0'
							value={item.product?.cost_price || 0}
							readonly={true}
						/>
					</label>
					<label className='w-52'>
						<span className='my-1 block'>Tan narxi($)</span>
						<Input
							className='w-full h-12'
							value={
								item?.product?.usd_rate
									? (
											item?.product?.cost_price / item?.product?.usd_rate
										).toFixed(2)
									: 0
							}
							readOnly
						/>
					</label>
				</>
			)}

			<label className='w-52'>
				<span className='my-1 block'>Sotuv narxi</span>
				<NumberInput
					className='w-full h-12'
					placeholder='0'
					value={item.product?.sale_price || 0}
					readonly={true}
				/>
			</label>

			<label className='w-52 relative'>
				<span className='my-1 block'>Miqdori *</span>
				<Input
					className='w-full h-12'
					type='number'
					placeholder='0'
					value={item.count === 0 ? '' : item.count} // 0 bo'lsa input bo'sh ko'rinadi
					onFocus={e => e.target.select()}
					onChange={e => handleCountChange(e.target.value)}
					onBlur={handleBlur} // <--- SHU YERDA QO'SHILDI
				/>
				{item.product && (
					<span className='absolute -bottom-6 left-0 text-sm'>
						Mavjud: {item.product.quantity}
					</span>
				)}
			</label>

			<label className='w-52'>
				<span className='my-1 block'>Chegirma UZS</span>
				<NumberInput
					value={item.discount ?? 0}
					onChange={handleDiscountChange}
					placeholder='0'
					className='w-full h-12'
				/>
			</label>

			<label className='w-56'>
				<span className='my-1 block'>Umumiy narxi</span>
				<NumberInput
					className='w-full h-12'
					placeholder='0'
					readonly={true}
					value={totalPrice}
				/>
			</label>
		</div>
	)
}

export default OrderItem

// order-item.tsx
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import NumberInput from '@/components/_components/number-input'
import { useAppDispatch } from '@/store/hooks'
import { updateOrderItem, removeOrderItem } from '@/store/order-slice'
import { product } from '@/@types'

interface OrderItemProps {
	item: {
		id: string
		product: product
		count: number
		discount: number
		price: number
	}
	constPrice: boolean
}

const OrderItem = ({ item, constPrice }: OrderItemProps) => {
	const dispatch = useAppDispatch()

	const handleCountChange = (value: string) => {
		// Agar bo'sh bo'lsa 0 ga tenglashtiramiz (yozish jarayoni uchun)
		if (value === '') {
			dispatch(updateOrderItem({ id: item.id, updates: { count: 0 } }))
			return
		}

		// Vergulni nuqtaga aylantiramiz (ba'zi klaviaturalar uchun)
		let normalizedValue = value.replace(',', '.')
		let num = Number(normalizedValue)

		if (isNaN(num)) return

		// Ombordagi qoldiqdan oshib ketmasligini tekshirish
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
		// O'ZGARISH: 1 dan emas, 0 dan kichik yoki teng bo'lsa 1 ga qaytarish.
		// Bu 0.1, 0.5 kabi raqamlarga ruxsat beradi.
		if (!item.count || item.count <= 0) {
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

	const totalPrice = (item.price - item.discount) * item.count

	return (
		<div className='group relative w-full flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200'>
			<button
				onClick={handleRemove}
				className='absolute top-2 right-2 md:static md:order-last text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10'
				title="O'chirish"
			>
				<X className='h-5 w-5' />
			</button>

			<div className='flex-1 w-full md:w-auto flex flex-col gap-1'>
				<h3 className='font-semibold text-base leading-tight line-clamp-1'>
					{item.product.name}
				</h3>
				<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
					<div className='flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-md'>
						<span>Narxi:</span>
						<span className='font-medium text-foreground'>
							{item.product.sale_price.toLocaleString()}
						</span>
					</div>

					{constPrice && (
						<div className='flex gap-2 text-xs opacity-80'>
							<span>Tan: {item.product?.cost_price?.toLocaleString()}</span>
							{item.product?.usd_rate && (
								<span>
									($
									{(item.product.cost_price / item.product.usd_rate).toFixed(2)}
									)
								</span>
							)}
						</div>
					)}
				</div>
			</div>

			{/* 3. INPUTS SECTION (Count & Discount) */}
			<div className='flex items-end gap-3 w-full md:w-auto justify-between md:justify-start'>
				{/* Count Input */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1'>
						Miqdor
					</label>
					<div className='relative'>
						<Input
							className='w-20 h-9 text-center font-medium'
							type='number'
							// O'ZGARISH: step="any" kasr sonlarni kiritishga ruxsat beradi
							step='any'
							// 0 bo'lsa bo'sh ko'rsatish, aks holda qiymatni string qilib berish
							value={item.count === 0 ? '' : item.count.toString()}
							onFocus={e => e.target.select()}
							onChange={e => handleCountChange(e.target.value)}
							onBlur={handleBlur}
							min={0}
						/>
						<div className='absolute right-0 -bottom-4 text-[10px] text-muted-foreground w-full text-right pr-1'>
							max: {item.product.quantity}
						</div>
					</div>
				</div>

				{/* Discount Input */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1'>
						Chegirma
					</label>
					<NumberInput
						value={item.discount ?? 0}
						onChange={handleDiscountChange}
						placeholder='0'
						className='w-28 h-9 text-right pr-3 font-medium'
					/>
				</div>
			</div>

			{/* 4. TOTAL PRICE SECTION */}
			<div className='flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-40 pl-4 md:border-l border-dashed border-border gap-1'>
				<span className=' text-sm font-medium text-muted-foreground'>
					Jami summa:
				</span>
				<div className='flex flex-col items-end'>
					<span className='text-lg font-bold text-primary tracking-tight'>
						{totalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
						<span className='text-xs font-normal text-muted-foreground ml-1'>
							UZS
						</span>
					</span>
					{item.discount > 0 && (
						<span className='text-xs text-green-600 font-medium'>
							-
							{(item.discount * item.count).toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}{' '}
							skidka
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

export default OrderItem

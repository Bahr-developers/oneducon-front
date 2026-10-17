import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import NumberInput from '@/components/_components/number-input'
import { useAppDispatch } from '@/store/hooks'
import { updateOrderItem, removeOrderItem } from '@/store/order-slice'
import type { OrderItem as OrderItemData } from '@/store/order-slice'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface OrderItemProps {
	item: OrderItemData
	constPrice: boolean
}

const OrderItem = ({ item, constPrice }: OrderItemProps) => {
	const dispatch = useAppDispatch()
	const [localCount, setLocalCount] = useState(item.count.toString())

	// Har bir item uchun alohida switch holati
	const [useAltPrice, setUseAltPrice] = useState(false)

	// Switch yoqilganda qaysi narx ishlatiladi
	const selectedPrice = useMemo(() => {
		if (useAltPrice) {
			return (
				item.product?.wholesale_price ?? item.product?.cost_price ?? item.price
			)
		}
		return item.product?.sale_price ?? item.price
	}, [
		useAltPrice,
		item.product?.wholesale_price,
		item.product?.cost_price,
		item.product?.sale_price,
		item.price,
	])

	useEffect(() => {
		if (Number(localCount) !== item.count) {
			setLocalCount(item.count === 0 ? '' : item.count.toString())
		}
	}, [item.count, localCount])

	useEffect(() => {
		if (item.price !== selectedPrice) {
			dispatch(
				updateOrderItem({
					id: item.id,
					updates: {
						price: selectedPrice,
						discount: Math.min(item.discount, selectedPrice),
					},
				}),
			)
		}
	}, [dispatch, item.id, item.price, item.discount, selectedPrice])

	const handleCountChange = (value: string) => {
		const normalizedValue = value.replace(',', '.')

		setLocalCount(normalizedValue)

		if (normalizedValue === '') {
			dispatch(updateOrderItem({ id: item.id, updates: { count: 0 } }))
			return
		}

		let num = Number(normalizedValue)

		if (isNaN(num)) return

		if (item.product?.quantity && num > item.product.quantity) {
			num = item.product.quantity
			setLocalCount(num.toString())
		}

		dispatch(
			updateOrderItem({
				id: item.id,
				updates: { count: num },
			}),
		)
	}

	const handleBlur = () => {
		const currentVal = Number(localCount.replace(',', '.'))

		if (!currentVal || currentVal <= 0) {
			setLocalCount('1')
			dispatch(
				updateOrderItem({
					id: item.id,
					updates: { count: 1 },
				}),
			)
		} else {
			setLocalCount(currentVal.toString())
		}
	}

	const subtotal = item.price * item.count
	const totalPrice = (item.price - item.discount) * item.count

	const handleTotalPriceChange = ({ raw: enteredTotal }: { raw: number }) => {
		if (!Number.isFinite(enteredTotal) || item.count <= 0) return

		const finalTotal = Math.min(subtotal, Math.max(0, enteredTotal))
		const discountPerItem = (subtotal - finalTotal) / item.count

		dispatch(
			updateOrderItem({
				id: item.id,
				updates: { discount: discountPerItem },
			}),
		)
	}

	const handleRemove = () => {
		dispatch(removeOrderItem(item.id))
	}

	const handleToggle = (checked: boolean) => {
		setUseAltPrice(checked)
	}

	return (
		<div className='group relative w-full flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 pt-5'>
			<button
				onClick={handleRemove}
				className='absolute top-2 right-2 md:static md:order-last text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10'
				title="O'chirish"
			>
				<X className='h-5 w-5' />
			</button>

			<div className=' w-full md:w-auto flex flex-col gap-2'>
				<div className='absolute top-0 right-2 flex items-center justify-end space-x-2 my-1'>
					<Switch
						id={`price-switch-${item.id}`}
						checked={useAltPrice}
						onCheckedChange={handleToggle}
						className='data-[state=checked]:bg-[#6A81FF]'
					/>
					<Label
						htmlFor={`price-switch-${item.id}`}
						className={`${useAltPrice ? 'text-[#6A81FF]' : 'text-primary'}`}
					>
						Ulgurji narx
					</Label>
				</div>
				<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
					<div className='flex flex-col items-start gap-1 bg-secondary/50 px-2 py-1 rounded-md'>
						<h3 className='font-semibold text-base leading-tight line-clamp-1'>
							{item.product.name}
						</h3>

						<div className='text-[13px] text-muted-foreground'>
							Sotuv narxi: {item.product.sale_price?.toLocaleString()} UZS
						</div>
						{constPrice && (
							<div className='text-[13px] flex gap-2 items-center text-muted-foreground'>
								Tan narxi:
								<span className='flex items-center gap-2'>
									{item.product.cost_price?.toLocaleString()}
									<span className='w-[2px] h-[15px] bg-gray-500 rounded-xl'></span>
									{item.product.cost_price_usd?.toLocaleString()}$
								</span>
							</div>
						)}
						{/* {constPrice && (
							<div className='text-[13px] text-muted-foreground font-medium'>
								Tan narxi(usd):{item.product.sale_price_usd?.toLocaleString()}$
							</div>
						)} */}
					</div>
				</div>
			</div>

			<div className='flex items-end gap-3 w-full md:w-auto justify-between md:justify-start'>
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1'>
						Miqdor
					</label>
					<div className='relative'>
						<Input
							className='w-20 h-9 text-center font-medium'
							type='text'
							inputMode='decimal'
							value={localCount}
							onFocus={e => e.target.select()}
							onChange={e => handleCountChange(e.target.value)}
							onBlur={handleBlur}
						/>
						<div className='absolute right-0 -bottom-4 text-[10px] text-muted-foreground w-full text-right pr-1'>
							max: {item.product.quantity}
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-1.5'>
					<label
						htmlFor={`final-total-${item.id}`}
						className='text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1'
					>
						Chegirmadan keyingi summa
					</label>
					<NumberInput
						id={`final-total-${item.id}`}
						value={Number(totalPrice.toFixed(2))}
						onChange={handleTotalPriceChange}
						onFocus={event => event.target.select()}
						max={subtotal}
						disabled={item.count <= 0}
						placeholder='0'
						className='w-36 h-9 text-right pr-3 font-medium'
					/>
				</div>
			</div>

			<div className='flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-40 pl-4 md:border-l border-dashed border-border gap-1'>
				<span className='text-sm font-medium text-muted-foreground'>
					Jami summa:
				</span>
				<div className='flex flex-col items-end'>
					<span
						className={`text-lg font-bold  tracking-tight ${useAltPrice ? 'text-[#6A81FF]' : 'text-primary'}`}
					>
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
							})}
							skidka
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

export default OrderItem

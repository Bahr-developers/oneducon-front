import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { X, Eye, EyeOff } from 'lucide-react'
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
	const [discountMode, setDiscountMode] = useState<'amount' | 'percent'>(
		'amount',
	)

	const [localCount, setLocalCount] = useState(item.count.toString())
	const [showPrices, setShowPrices] = useState(false)

	useEffect(() => {
		if (Number(localCount) !== item.count) {
			setLocalCount(item.count === 0 ? '' : item.count.toString())
		}
	}, [item.count])

	const handleCountChange = (value: string) => {
		let normalizedValue = value.replace(',', '.')

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
		let currentVal = Number(localCount.replace(',', '.'))

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

	const handleDiscountChange = (val: { raw: number }) => {
		const enteredValue = Number(val?.raw ?? 0)
		if (isNaN(enteredValue)) return

		let discountValue = 0

		if (discountMode === 'percent') {
			const safePercent = Math.min(100, Math.max(0, enteredValue))
			discountValue = (item.price * safePercent) / 100
		} else {
			discountValue = Math.min(item.price, Math.max(0, enteredValue))
		}

		dispatch(
			updateOrderItem({
				id: item.id,
				updates: { discount: discountValue },
			}),
		)
	}

	const handleRemove = () => {
		dispatch(removeOrderItem(item.id))
	}

	const totalPrice = (item.price - item.discount) * item.count
	const discountInputValue =
		discountMode === 'percent' && item.price > 0
			? (item.discount / item.price) * 100
			: item.discount

	const maskedValue = '******'

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
						<span className='font-medium text-foreground text-[15px]'>
							{item.product.sale_price.toLocaleString()}
						</span>
					</div>

					{constPrice && (
						<div className='flex items-start gap-2'>
							<div className='flex flex-col gap-2 text-[15px] font-medium'>
								<div>
									<span>
										Tan:{' '}
										{showPrices
											? item.product?.cost_price?.toLocaleString()
											: maskedValue}
									</span>

									{item.product?.usd_rate && (
										<span>
											{' '}
											(
											{showPrices
												? `$${(
														item.product.cost_price / item.product.usd_rate
													).toFixed(2)}`
												: maskedValue}
											)
										</span>
									)}
								</div>

								<span>
									Ulgurji:{' '}
									{showPrices
										? item.product?.wholesale_price
											? item.product.wholesale_price.toLocaleString()
											: item.product?.cost_price?.toLocaleString()
										: maskedValue}{' '}
									UZS
								</span>
							</div>

							<button
								type='button'
								onClick={() => setShowPrices(prev => !prev)}
								className='mt-0.5 p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground'
								title={showPrices ? 'Narxni yashirish' : 'Narxni ko‘rsatish'}
							>
								{showPrices ? (
									<EyeOff className='w-4 h-4' />
								) : (
									<Eye className='w-4 h-4' />
								)}
							</button>
						</div>
					)}
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
					<label className='text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1'>
						Chegirma
					</label>
					<div className='flex items-center gap-1'>
						<NumberInput
							value={discountInputValue}
							onChange={handleDiscountChange}
							placeholder='0'
							className='w-24 h-9 text-right pr-3 font-medium'
						/>
						<div className='flex h-9 rounded-md border overflow-hidden'>
							<button
								type='button'
								onClick={() => setDiscountMode('percent')}
								className={`px-2 text-xs font-semibold transition-colors ${
									discountMode === 'percent'
										? 'bg-primary text-primary-foreground'
										: 'bg-background text-muted-foreground hover:bg-muted'
								}`}
							>
								%
							</button>
							<button
								type='button'
								onClick={() => setDiscountMode('amount')}
								className={`px-2 text-xs font-semibold transition-colors ${
									discountMode === 'amount'
										? 'bg-primary text-primary-foreground'
										: 'bg-background text-muted-foreground hover:bg-muted'
								}`}
							>
								UZS
							</button>
						</div>
					</div>
				</div>
			</div>

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

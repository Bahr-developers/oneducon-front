import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import {
	updateOrderItem,
	removeOrderItem,
	OrderItem,
} from '@/store/order-slice'

interface OrderItemRowProps {
	item: OrderItem
	onEdit?: () => void
}

const OrderItemRow = ({ item, onEdit }: OrderItemRowProps) => {
	const dispatch = useAppDispatch()

	if (!item.product) return null

	const handleCountChange = (type: 'increment' | 'decrement') => {
		let newCount = item.count

		if (type === 'increment') {
			if (item.product?.quantity && item.count >= item.product.quantity) {
				return
			}
			newCount = item.count + 1
		} else {
			if (item.count <= 1) return
			newCount = item.count - 1
		}

		dispatch(
			updateOrderItem({
				id: item.id,
				updates: { count: newCount },
			}),
		)
	}

	const handleRemove = () => {
		dispatch(removeOrderItem(item.id))
	}

	const totalPrice = (item.price - item.discount) * item.count

	return (
		<div className='w-full rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] p-5'>
			{/* Header - ID and Actions */}
			<div className='flex justify-between items-start mb-3'>
				<div className='text-[#888] text-sm'>ID: {item.product.id}</div>
				<div className='flex gap-2'>
					{onEdit && (
						<Button
							size='icon'
							variant='ghost'
							onClick={onEdit}
							className='h-11 w-11 rounded-xl border border-[#333] hover:bg-[#2a2a2a] hover:border-[#444]'
						>
							<Pencil className='h-5 w-5 text-white' />
						</Button>
					)}
					<Button
						size='icon'
						variant='ghost'
						onClick={handleRemove}
						className='h-11 w-11 rounded-xl border border-[#333] hover:bg-[#2a2a2a] hover:border-[#444]'
					>
						<Trash2 className='h-5 w-5 text-white' />
					</Button>
				</div>
			</div>

			{/* Product Name */}
			<h3 className='text-white text-2xl font-semibold mb-2'>
				{item.product.name}
			</h3>

			{/* Category */}
			{item.product.category && (
				<div className='text-[#888] text-base mb-5'>
					{item.product.category.name || 'No category'}
				</div>
			)}

			{/* Bottom section - Price and Controls */}
			<div className='flex justify-between items-center'>
				{/* Quantity controls */}
				<div className='flex items-center gap-4'>
					<Button
						size='icon'
						variant='ghost'
						onClick={() => handleCountChange('decrement')}
						disabled={item.count <= 1}
						className='h-14 w-14 rounded-xl border border-[#333] hover:bg-[#2a2a2a] hover:border-[#444] disabled:opacity-30 disabled:cursor-not-allowed text-white text-2xl'
					>
						-
					</Button>
					<span className='text-white text-3xl font-medium min-w-[50px] text-center'>
						{item.count}
					</span>
					<Button
						size='icon'
						variant='ghost'
						onClick={() => handleCountChange('increment')}
						disabled={
							item.product?.quantity
								? item.count >= item.product.quantity
								: false
						}
						className='h-14 w-14 rounded-xl border border-[#333] hover:bg-[#2a2a2a] hover:border-[#444] disabled:opacity-30 disabled:cursor-not-allowed text-white text-2xl'
					>
						+
					</Button>
				</div>

				{/* Total price */}
				<div className='text-white text-4xl font-bold'>
					{totalPrice.toLocaleString()} UZS
				</div>
			</div>

			{/* Additional Info */}
			{item.discount > 0 && (
				<div className='mt-3 text-[#888] text-sm'>
					Chegirma: {item.discount.toLocaleString()} UZS
				</div>
			)}

			{item.product.quantity !== undefined && (
				<div className='mt-2 text-[#666] text-xs'>
					Mavjud: {item.product.quantity} dona
				</div>
			)}
		</div>
	)
}

export default OrderItemRow

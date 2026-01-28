// PaymentItem.tsx
import { X, CreditCard, Banknote } from 'lucide-react' // Iconlar qo'shildi
import NumberInput from '@/components/_components/number-input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	updatePayment,
	removePayment,
	selectTotals,
	selectPayments,
} from '@/store/order-slice'
import { useEffect, useRef } from 'react'

interface PaymentType {
	id: string
	name: string
}

interface PaymentItemProps {
	index: number
	payment: {
		payment_type_id: string
		price: number
		isNew?: boolean
		userModified?: boolean
	}
	paymentTypes?: PaymentType[]
}

const PaymentItem = ({ index, payment, paymentTypes }: PaymentItemProps) => {
	const dispatch = useAppDispatch()
	const totals = useAppSelector(selectTotals)
	const payments = useAppSelector(selectPayments)
	const inputRef = useRef<HTMLInputElement>(null)
	const { totalItemsAmount } = totals

	useEffect(() => {
		const previousPayments = payments
			.slice(0, index)
			.reduce((sum, p) => sum + Number(p.price || 0), 0)

		const remainingAmount = Math.max(0, totalItemsAmount - previousPayments)

		if (payment.isNew || !payment.userModified) {
			if (payment.price !== remainingAmount) {
				dispatch(
					updatePayment({
						index,
						payment: { ...payment, price: remainingAmount, isNew: false },
					}),
				)
			}
		}
	}, [totalItemsAmount, payments, index, payment, dispatch])

	const handleSelectType = (typeId: string) => {
		dispatch(
			updatePayment({
				index,
				payment: { ...payment, payment_type_id: typeId, isNew: false },
			}),
		)
	}

	const selectedPaymentTypes = payments
		.filter((_, i) => i !== index)
		.map(p => p.payment_type_id)
		.filter(Boolean)

	const handlePriceChange = (val: { raw: number }) => {
		const otherPaymentsTotal = payments
			.filter((_, i) => i !== index)
			.reduce((sum, p) => sum + Number(p.price || 0), 0)

		const maxAllowedPrice = Math.max(0, totalItemsAmount - otherPaymentsTotal)
		const newPrice = Math.min(val.raw, maxAllowedPrice)

		dispatch(
			updatePayment({
				index,
				payment: {
					...payment,
					price: newPrice,
					isNew: false,
					userModified: true,
				},
			}),
		)
	}

	const handleRemove = () => {
		dispatch(removePayment(index))
	}

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		e.target.select()
	}

	return (
		<div className='group relative flex flex-col md:flex-row items-end md:items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200'>
			<button
				onClick={handleRemove}
				className='absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-full hover:bg-destructive/10'
				title="O'chirish"
			>
				<X className='h-4 w-4' />
			</button>

			<div className='flex-1 w-full space-y-1.5'>
				<label className='text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1 flex items-center gap-1'>
					<CreditCard className='w-3 h-3' /> To'lov turi
				</label>
				<Select
					value={payment.payment_type_id || ''}
					onValueChange={handleSelectType}
				>
					<SelectTrigger size='sm' className='w-full h-10 bg-background'>
						<SelectValue placeholder='Tanlang' />
					</SelectTrigger>
					<SelectContent>
						{paymentTypes?.map(type => {
							const isDisabled = selectedPaymentTypes.includes(type.id)
							return (
								<SelectItem key={type.id} value={type.id} disabled={isDisabled}>
									{type.name} {isDisabled ? '(tanlangan)' : ''}
								</SelectItem>
							)
						})}
					</SelectContent>
				</Select>
			</div>

			<div className='w-full md:w-48 space-y-1.5'>
				<label className='text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1 flex items-center gap-1'>
					<Banknote className='w-3 h-3' /> Summa (UZS)
				</label>
				<div className='relative'>
					<NumberInput
						ref={inputRef}
						value={payment.price}
						onChange={handlePriceChange}
						placeholder='0'
						className='w-full h-8 font-medium pr-3 bg-background'
						onFocus={handleFocus}
					/>
				</div>
			</div>
		</div>
	)
}

export default PaymentItem

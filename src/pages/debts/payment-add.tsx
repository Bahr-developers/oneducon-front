import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { debt } from '@/@types'
import { Input } from '@/components/ui/input'
import NumberInput from '@/components/_components/number-input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { debtsUtils } from '@/utils/debts'
import toast from 'react-hot-toast'
const PaymentAdd = ({ debt }: { debt: debt }) => {
	const [open, setOpen] = useState(false)
	const [paymentSum, setPaymentSum] = useState(debt?.remaining_amount || 0)
	const [note, setNote] = useState('')
	const queryClient = useQueryClient()

	const addPayment = useMutation({
		mutationFn: debtsUtils.paymentDebts,
		onSuccess: () => {
			toast.success("To'lov muvaffaqiyatli qo'shildi")
			setOpen(false)
			queryClient.invalidateQueries({ queryKey: ['get_all_client_debts'] })
		},
		onError: err => {
			console.log(err)
		},
	})

	const handleAddPayment = () => {
		addPayment.mutate({
			amount: paymentSum,
			debts_id: debt.id,
			note,
		})
	}
	const isValid =
		paymentSum > 0 && paymentSum <= (debt?.order?.total_price || 0)
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className='bg-green-700 text-white hover:bg-green-800 cursor-pointer hover:text-white'
					variant={'outline'}
				>
					To'lash
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-4xl max-h-[90vh]'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<ShoppingCart className='h-5 w-5' />
						Buyurtma #{debt?.order?.order_number}
					</DialogTitle>
					<DialogDescription>
						Mijoz: {debt?.client?.name} | Telefon: +{debt?.client?.phone}
					</DialogDescription>
				</DialogHeader>

				<div className='flex items-center flex-col gap-4'>
					<label className='w-full'>
						<span>To'lov summasi(UZS)</span>
						<NumberInput
							value={paymentSum}
							onChange={e => setPaymentSum(e.raw)}
							placeholder="To'lov summasini kiriting"
							className='mt-1 h-12 w-full'
						/>
					</label>

					<label className='w-full'>
						<span>Qo'shimcha izoh</span>
						<Input
							value={note}
							onChange={e => setNote(e.target.value)}
							placeholder="Qo'shimcha izoh kiriting"
							className='mt-1 h-12 w-full'
						/>
					</label>
				</div>

				<Button
					disabled={!isValid}
					onClick={handleAddPayment}
					size={'lg'}
					className='bg-green-700 text-white hover:bg-green-800 cursor-pointer hover:text-white mt-6 w-full'
				>
					To'lash
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default PaymentAdd

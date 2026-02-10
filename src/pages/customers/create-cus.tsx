import PhoneInput from '@/components/_components/phone-input'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { customerUtils } from '@/utils/customer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface cusCreate {
	title?: string
	width?: string
}

const CreateCustomer = ({ title, width = '50px' }: cusCreate) => {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [phone, setPhone] = useState({
		formatted: '+998 ',
		raw: '',
		isValid: false,
	})
	const queryClient = useQueryClient()
	const storeId = localStorage.getItem('storeId')

	const createCustomer = useMutation({
		mutationFn: customerUtils.postCustomer,
		onSuccess: () => {
			toast.success("Mijoz muvaffaqiyatli qo'shildi")
			queryClient.invalidateQueries({ queryKey: ['customers'] })
			setOpen(false)
			setPhone({
				formatted: '+998 ',
				raw: '',
				isValid: false,
			})
			setName('')
		},
		onError: err => {
			const error = err as AxiosError<{ message: string }>
			toast.error(error.response?.data.message || 'Something went wrong!')
			console.log(error)
		},
	})
	const isValid = name.trim()?.length > 0 && phone.isValid

	const handleCreateCustomer = () => {
		if (!isValid) return
		createCustomer.mutate({
			name,
			phone: phone.raw,
			store_id: Number(storeId),
		})
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				className={`flex items-center justify-center w-[50px] h-12  gap-x-2 cursor-pointer border p-2 rounded-lg text-[15px] font-medium + ${width}`}
			>
				{title} <Plus size={20} />
			</DialogTrigger>

			<DialogContent w='w-[650px]'>
				<DialogHeader>
					<DialogTitle>Mijoz yaratish</DialogTitle>
					<DialogDescription></DialogDescription>
					<div className='flex items-center gap-x-4'>
						<label className='w-full'>
							<span>Mijoz ismi</span>
							<Input
								onChange={e => setName(e.target.value)}
								autoFocus
								placeholder='Mijoz ismini kiriting'
								className='mt-1 h-12 w-full'
							/>
						</label>
						<label className='w-full'>
							<span>Mijoz telefon raqami</span>
							<PhoneInput
								value={phone.formatted}
								onChange={data => setPhone(data)}
								className='h-12 mt-1 w-full'
							/>
						</label>
					</div>
					<Button
						disabled={!isValid}
						onClick={handleCreateCustomer}
						className='w-[250px] mt-5 ml-auto'
					>
						Qo'shish
					</Button>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default CreateCustomer

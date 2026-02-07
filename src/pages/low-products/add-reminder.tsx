import NumberInput from '@/components/_components/number-input'
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
import { reminderUtils } from '@/utils/reminder'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'

const AddReminder = () => {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [count, setCount] = useState(0)
	const queryClient = useQueryClient()
	const addRemider = useMutation({
		mutationFn: reminderUtils.postReminder,
		onSuccess: () => {
			toast.success("Eslatma qo'shildi")
			setOpen(false)
			queryClient.invalidateQueries({ queryKey: ['get_reminder_products'] })
		},
		onError: err => console.log(err),
	})

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				onClick={() => setOpen(true)}
				className='bg-indigo-600 text-white p-2 rounded-lg'
			>
				Eslatma qo'shish
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Eslatma mahsulot qo'shish</DialogTitle>
					<DialogDescription>
						Mahsulotlarni eslatma sifatida qo'shish !
					</DialogDescription>
					<div className='w-full flex flex-col items-end'>
						<div className='flex flex-col space-y-2 items-center w-full justify-between gap-x-2'>
							<label className='flex flex-col space-y-1 w-full'>
								<span>
									Nomi <span className='text-red-300'> *</span>
								</span>
								<Input
									autoFocus
									name='name'
									placeholder='Mahsulot nomi'
									onChange={e => setName(e.target.value)}
									className='h-12 w-full'
								/>
							</label>
							<label className='flex flex-col space-y-1 w-full'>
								<span>Miqdor</span>
								<NumberInput
									placeholder='Mahsulot miqdori'
									onChange={e => setCount(e.raw)}
									className='h-12 w-full'
								/>
							</label>
						</div>
						<div className='flex items-center gap-2 my-3 w-full'></div>
						<Button
							onClick={() =>
								addRemider.mutate({
									name,
									quantity: count ? Number(count) : null,
								})
							}
							className=' w-full h-10'
							disabled={!name}
						>
							Qo'shish
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default AddReminder

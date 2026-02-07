import { ReminderItem } from '@/@types'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const EditReminder = (id: { id: string }) => {
	const [open, setOpen] = useState(false)
	const { data: reminderProduct, isLoading } = useQuery<{ data: ReminderItem }>(
		{
			queryKey: ['get_reminder_by_id'],
			queryFn: () => reminderUtils.getReminderById(id),
			enabled: !!open && !!id,
		},
	)
	const [name, setName] = useState(reminderProduct?.data?.name || '')
	const [count, setCount] = useState(reminderProduct?.data?.quantity)
	const queryClient = useQueryClient()
	useEffect(() => {
		if (reminderProduct?.data) {
			setName(reminderProduct.data.name)
			setCount(reminderProduct.data.quantity)
		}
	}, [reminderProduct])
	const editRemider = useMutation({
		mutationFn: reminderUtils.editReminder,
		onSuccess: () => {
			toast.success('Eslatma yangilandi')
			setOpen(false)
			queryClient.invalidateQueries({ queryKey: ['get_reminder_products'] })
		},
		onError: err => console.log(err),
	})

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger className='flex items-center gap-x-2 cursor-pointer'>
				<Pencil size={20} />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Eslatma mahsulot qo'shish</DialogTitle>
					<DialogDescription>
						Mahsulotlarni eslatma sifatida qo'shish !
					</DialogDescription>
					<div className='w-full flex flex-col items-end'>
						{isLoading ? (
							<div className='h-42 flex justify-center items-center w-full'>
								Yuklanmoqda...
							</div>
						) : (
							<div className='flex flex-col space-y-2 items-center w-full justify-between gap-x-2'>
								<label className='flex flex-col space-y-1 w-full'>
									<span>
										Nomi <span className='text-red-300'> *</span>
									</span>
									<Input
										autoFocus
										name='name'
										defaultValue={name}
										placeholder='Mahsulot nomi'
										onChange={e => setName(e.target.value)}
										className='h-12 w-full'
									/>
								</label>
								<label className='flex flex-col space-y-1 w-full'>
									<span>Miqdor</span>
									<NumberInput
										value={count}
										placeholder='Mahsulot miqdori'
										onChange={e => setCount(e.raw)}
										className='h-12 w-full'
									/>
								</label>
							</div>
						)}
						<div className='flex items-center gap-2 my-3 w-full'></div>
						<Button
							onClick={() =>
								editRemider.mutate({
									reqData: { name, quantity: count ? Number(count) : null },
									id: id.id,
								})
							}
							className=' w-full h-10'
						>
							Tahrirlash
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default EditReminder

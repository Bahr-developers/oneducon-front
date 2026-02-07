// components/edit-expense-modal.tsx
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { expense } from '@/@types'

interface EditExpenseModalProps {
	expense: expense | null
	isOpen: boolean
	onClose: () => void
	onSave: (expense: expense) => void
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
	expense,
	isOpen,
	onClose,
	onSave,
}) => {
	const [formData, setFormData] = useState<Partial<expense>>({})

	useEffect(() => {
		if (expense) {
			setFormData(expense)
		}
	}, [expense])

	const handleSave = () => {
		if (expense && formData.definition && formData.price) {
			onSave({
				...expense,
				...formData,
				updated_at: new Date().toISOString(),
			})
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle>Xarajatni tahrirlash</DialogTitle>
					<DialogDescription>
						Xarajat ma'lumotlarini o'zgartiring va saqlang.
					</DialogDescription>
				</DialogHeader>

				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='definition'>Ta'rif</Label>
						<Input
							id='definition'
							value={formData.definition || ''}
							onChange={e =>
								setFormData({ ...formData, definition: e.target.value })
							}
							placeholder="Xarajat ta'rifini kiriting"
						/>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='price'>Narx (UZS)</Label>
						<Input
							id='price'
							type='number'
							value={formData.price || ''}
							onChange={e =>
								setFormData({ ...formData, price: Number(e.target.value) })
							}
							placeholder='Xarajat narxini kiriting'
						/>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='store_id'>Do'kon ID</Label>
						<Input
							id='store_id'
							value={formData.store_id || ''}
							onChange={e =>
								setFormData({ ...formData, store_id: e.target.value })
							}
							placeholder="Do'kon ID sini kiriting"
						/>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='expense_type'>Xarajat turi</Label>
						<Select
							value={formData.expense_type_id}
							onValueChange={value =>
								setFormData({ ...formData, expense_type_id: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Xarajat turini tanlang' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='1'>O'ziq ovqat</SelectItem>
								<SelectItem value='2'>Transport</SelectItem>
								<SelectItem value='3'>Kommunal</SelectItem>
								<SelectItem value='4'>Boshqa</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={onClose}>
						Bekor qilish
					</Button>
					<Button onClick={handleSave}>Saqlash</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

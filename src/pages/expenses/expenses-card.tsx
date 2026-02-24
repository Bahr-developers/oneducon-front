// components/expense-card.tsx
import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/utils'
import { Edit, Tag, Calendar, Clock } from 'lucide-react'
import { expense } from '@/@types'
import { DeleteConfirm } from '@/components/ui/alerd-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { expensesUtils } from '@/utils/expenses'
import toast from 'react-hot-toast'

interface ExpenseCardProps {
	expense: expense
	onEdit: (expense: expense) => void
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
	expense,
	onEdit,
}) => {
	const queryClient = useQueryClient()
	const deleteExpense = useMutation({
		mutationFn: expensesUtils.deleteExpenses,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['get_expenses_data'] })
			queryClient.invalidateQueries({ queryKey: ['get_stats'] })
			toast.success("Xajajat o'chirildi")
		},
		onError: err => {
			console.log(err)
		},
	})
	return (
		<Card className='w-full max-w-2xl mx-auto hover:shadow-lg transition-all duration-300 border-l-4 py-5'>
			<CardHeader className=''>
				<div className='flex justify-between items-start gap-2'>
					<div className='flex items-center gap-2'>
						<div className='px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'>
							<Tag className='w-4 h-4' />
							<span
								className='line-clamp-1 cursor-pointer'
								title={expense.expense_type.name}
							>
								{expense.expense_type.name}
							</span>
						</div>
					</div>
					<div className='text-2xl font-bold'>{formatPrice(expense.price)}</div>
				</div>
			</CardHeader>

			<CardContent className='space-y-1 py-0'>
				<div>
					<h3 className='font-semibold  mb-2'>Ta'rif:</h3>
					<p className='p-3 rounded-lg border'>{expense.definition}</p>
				</div>

				<div className='flex flex-col justify-between items-start gap-4'>
					<div className='space-y-2 text-xs'>
						<div className='flex items-center gap-2'>
							<Calendar className='w-4 h-4' />
							<span>Yaratilgan: {formatDate(expense.created_at)}</span>
						</div>
						<div className='flex items-center gap-2'>
							<Clock className='w-4 h-4' />
							<span>Yangilangan: {formatDate(expense.updated_at)}</span>
						</div>
					</div>

					<div className='flex gap-2 justify-end w-full'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => onEdit(expense)}
							className='flex items-center gap-2'
						>
							<Edit className='w-4 h-4' />
							Tahrirlash
						</Button>
						<DeleteConfirm
							onConfirm={() => deleteExpense.mutate(expense.id || '1')}
							title="O'chirish"
							variant='outline'
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

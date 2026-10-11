import { expense } from '@/@types'
import { DeleteConfirm } from '@/components/ui/alerd-dialog'
import { Button } from '@/components/ui/button'
import { formatDate, formatPrice } from '@/lib/utils'
import { expensesUtils } from '@/utils/expenses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Edit, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

interface ExpenseCardProps { expense: expense; onEdit: (expense: expense) => void }

export const ExpenseCard = ({ expense, onEdit }: ExpenseCardProps) => {
	const queryClient = useQueryClient()
	const deleteExpense = useMutation({
		mutationFn: expensesUtils.deleteExpenses,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['get_expenses_data'] })
			queryClient.invalidateQueries({ queryKey: ['get_stats'] })
			toast.success('Xarajat o‘chirildi')
		},
		onError: () => toast.error('Xarajatni o‘chirib bo‘lmadi'),
	})

	return (
		<div className='grid gap-3 px-4 py-4 transition-colors hover:bg-muted/20 md:grid-cols-[minmax(190px,1fr)_minmax(220px,1.5fr)_180px_190px] md:items-center md:gap-4'>
			<div className='min-w-0'><div className='flex items-center gap-2 text-xs font-medium text-[#536BE8]'><Tag className='size-3.5' /> {expense.expense_type?.name || 'Kategoriyasiz'}</div><p className='mt-1 truncate font-medium' title={expense.definition}>{expense.definition}</p></div>
			<div className='flex items-center gap-2 text-sm text-muted-foreground'><CalendarDays className='size-4 shrink-0' /><span>{formatDate(expense.created_at)}</span></div>
			<div className='text-lg font-medium tabular-nums md:text-right'>{formatPrice(expense.price)}</div>
			<div className='flex items-center justify-end gap-2'><Button variant='outline' size='sm' onClick={() => onEdit(expense)}><Edit /> Tahrirlash</Button><DeleteConfirm onConfirm={() => deleteExpense.mutate(expense.id)} title='O‘chirish' variant='outline' /></div>
		</div>
	)
}

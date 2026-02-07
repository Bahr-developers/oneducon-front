import { expense } from '@/@types'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { EditExpenseModal } from './edit-expenses'
import { ExpenseCard } from './expenses-card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { expensesUtils } from '@/utils/expenses'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryParams } from '@/components/functions/query-params'
import PaginationContyent from '@/components/_components/pagination'
import FilterExpenses from './filter-expenses'
import ExpenseForm from './create-expenses'
import { formatDateServer, formatPrice } from '@/lib/utils'

const ExpensesTable = () => {
	const { updateURL, getParam } = useQueryParams()
	const [from, setFrom] = useState<Date | undefined>()
	const [to, setTo] = useState<Date | undefined>()
	const storeId = localStorage.getItem('storeId') || 1

	// URL dan qiymatlarni olish
	const [postsPerPage, setPostsPerPage] = useState<number>(() =>
		parseInt(getParam('limit', '6')),
	)
	const [currentPage, setCurrentPage] = useState<number>(() =>
		parseInt(getParam('page', '1')),
	)
	const { data: expensesData, isLoading } = useQuery<{
		data: expense[]
		total: number
	}>({
		queryKey: ['get_expenses_data', postsPerPage, currentPage, from, to],
		queryFn: () =>
			expensesUtils.getExpenses({
				limit: postsPerPage,
				page: currentPage,
				from: formatDateServer(from),
				to: formatDateServer(to),
			}),
	})
	const { data: dataStats } = useQuery<{ totalExpenses: number }>({
		queryKey: ['get_stats', from, to],
		queryFn: () =>
			expensesUtils.getExpensesByStats({
				storeId: +storeId,
				from: formatDateServer(from),
				to: formatDateServer(to),
			}),
	})

	const expenses = expensesData?.data

	const totalPages = Math.max(
		1,
		Math.ceil((expensesData?.total || 1) / postsPerPage),
	)

	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(1)
	}, [currentPage, totalPages])

	const queryClient = useQueryClient()
	const [editingExpense, setEditingExpense] = useState<expense | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const editExpenses = useMutation({
		mutationFn: expensesUtils.editExpenses,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['get_expenses_data'] })
			setIsModalOpen(false)
			setEditingExpense(null)
			toast.success('Xarajat yangilandi')
		},
		onError: err => {
			console.log(err)
			toast.error('Xatolik mavjud')
		},
	})

	const handleEdit = (expense: expense) => {
		setEditingExpense(expense)
		setIsModalOpen(true)
	}

	const handleSave = (expense: expense) => {
		editExpenses.mutate({
			definition: expense.definition,
			expense_type_id: Number(expense.expense_type_id),
			id: expense.id,
			price: expense.price,
		})
	}

	useEffect(() => {
		updateURL({
			page: currentPage?.toString(),
			limit: postsPerPage?.toString(),
		})
	}, [currentPage, postsPerPage, updateURL])
	return (
		<div className='w-full'>
			<div className='w-full flex justify-between items-center my-2'>
				<h3 className='text-2xl font-bold'>
					{formatPrice(dataStats?.totalExpenses || 0)}{' '}
				</h3>
				<div className='flex items-center gap-x-2 justify-end'>
					<FilterExpenses from={from} setFrom={setFrom} setTo={setTo} to={to} />
					<ExpenseForm />
				</div>
			</div>
			<div className='w-full grid grid-cols-3 gap-2'>
				{isLoading ? (
					<>
						<Skeleton className='w-[350px] h-[250px] rounded-lg' />
						<Skeleton className='h-[250px] w-[350px] rounded-lg' />
						<Skeleton className='h-[250px] w-[350px] rounded-lg' />
						<Skeleton className='h-[250px] w-[350px] rounded-lg' />
					</>
				) : (
					expenses?.map(expense => (
						<ExpenseCard
							key={expense.id}
							expense={expense}
							onEdit={handleEdit}
						/>
					))
				)}
				<EditExpenseModal
					expense={editingExpense}
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false)
						setEditingExpense(null)
					}}
					onSave={handleSave}
				/>
			</div>
			<PaginationContyent
				currentPage={currentPage}
				setPostPerPage={n => {
					setPostsPerPage(n)
					setCurrentPage(1)
				}}
				postsPerPage={postsPerPage}
				setCurrentPage={n => setCurrentPage(n)}
				totalPosts={expensesData?.total || 0}
			/>
		</div>
	)
}

export default ExpensesTable

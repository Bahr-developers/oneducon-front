import { expense } from '@/@types'
import PaginationContyent from '@/components/_components/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryParams } from '@/hooks/query-params'
import { formatDateServer, formatPrice } from '@/lib/utils'
import { expensesUtils } from '@/utils/expenses'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ReceiptText, WalletCards } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ExpenseForm from './create-expenses'
import { EditExpenseModal } from './edit-expenses'
import { ExpenseCard } from './expenses-card'
import FilterExpenses from './filter-expenses'

function parseDateParam(value: string) {
	if (!value) return undefined
	const [year, month, day] = value.split('-').map(Number)
	if (!year || !month || !day) return undefined
	return new Date(year, month - 1, day)
}

const ExpensesTable = () => {
	const { updateURL, getParam } = useQueryParams()
	const [from, setFrom] = useState<Date | undefined>(() => parseDateParam(getParam('from')))
	const [to, setTo] = useState<Date | undefined>(() => parseDateParam(getParam('to')))
	const [postsPerPage, setPostsPerPage] = useState(() => parseInt(getParam('limit', '10')))
	const [currentPage, setCurrentPage] = useState(() => parseInt(getParam('page', '1')))
	const [editingExpense, setEditingExpense] = useState<expense | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const storeId = localStorage.getItem('storeId') || 1
	const fromParam = formatDateServer(from)
	const toParam = formatDateServer(to)

	const { data: expensesData, isLoading, isError } = useQuery<{ data: expense[]; total: number }>({
		queryKey: ['get_expenses_data', postsPerPage, currentPage, fromParam, toParam],
		queryFn: () => expensesUtils.getExpenses({ limit: postsPerPage, page: currentPage, from: fromParam, to: toParam }),
	})
	const { data: dataStats, isLoading: isStatsLoading } = useQuery<{ totalExpenses: number }>({
		queryKey: ['get_stats', fromParam, toParam],
		queryFn: () => expensesUtils.getExpensesByStats({ storeId: +storeId, from: fromParam, to: toParam }),
	})

	const queryClient = useQueryClient()
	const editExpenses = useMutation({
		mutationFn: expensesUtils.editExpenses,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['get_expenses_data'] })
			queryClient.invalidateQueries({ queryKey: ['get_stats'] })
			setIsModalOpen(false)
			setEditingExpense(null)
			toast.success('Xarajat yangilandi')
		},
		onError: () => toast.error('Xarajatni yangilab bo‘lmadi'),
	})

	useEffect(() => {
		updateURL({ page: String(currentPage), limit: String(postsPerPage), from: fromParam, to: toParam })
	}, [currentPage, postsPerPage, fromParam, toParam, updateURL])

	const expenses = expensesData?.data ?? []
	const setFilterFrom = (value: Date | undefined) => { setFrom(value); setCurrentPage(1) }
	const setFilterTo = (value: Date | undefined) => { setTo(value); setCurrentPage(1) }

	return (
		<div className='w-full space-y-5'>
			<header className='flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<div className='mb-2 flex items-center gap-2 text-sm font-medium text-[#536BE8]'><ReceiptText className='size-4' /> Moliyaviy jurnal</div>
					<h1 className='text-2xl font-medium tracking-[-0.02em] sm:text-3xl'>Xarajatlar</h1>
					<p className='mt-1 text-sm text-muted-foreground'>Do‘kon xarajatlarini kiriting va sana bo‘yicha nazorat qiling.</p>
				</div>
				<ExpenseForm />
			</header>

			<div className='grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]'>
				<div className='rounded-xl bg-[#18204A] p-5 text-white shadow-[0_16px_45px_rgba(25,36,92,0.16)]'>
					<div className='flex items-center justify-between'><p className='text-sm text-white/60'>Tanlangan davr xarajati</p><WalletCards className='size-5 text-[#8FA0FF]' /></div>
					{isStatsLoading ? <Skeleton className='mt-3 h-9 w-44 bg-white/10' /> : <p className='mt-3 break-words text-2xl font-medium tracking-[-0.03em] tabular-nums'>{formatPrice(dataStats?.totalExpenses || 0)}</p>}
					<p className='mt-3 text-xs text-white/50'>{fromParam || toParam ? `${fromParam || 'Boshidan'} — ${toParam || 'Bugungacha'}` : 'Barcha vaqt bo‘yicha'}</p>
				</div>
				<FilterExpenses from={from} to={to} setFrom={setFilterFrom} setTo={setFilterTo} />
			</div>

			<section className='overflow-hidden rounded-xl border bg-background'>
				<div className='hidden grid-cols-[minmax(190px,1fr)_minmax(220px,1.5fr)_180px_190px] gap-4 border-b bg-muted/25 px-4 py-3 text-xs font-medium text-muted-foreground md:grid'>
					<span>Kategoriya va xarajat</span><span>Sana</span><span className='text-right'>Summa</span><span className='text-right'>Amallar</span>
				</div>
				{isLoading ? (
					<div className='divide-y'>{Array.from({ length: 5 }).map((_, index) => <div key={index} className='grid gap-4 px-4 py-4 md:grid-cols-4'><Skeleton className='h-10' /><Skeleton className='h-10' /><Skeleton className='h-10' /><Skeleton className='h-10' /></div>)}</div>
				) : isError ? (
					<div className='p-10 text-center text-sm text-red-500'>Xarajatlarni yuklab bo‘lmadi. Sahifani yangilab qayta urinib ko‘ring.</div>
				) : expenses.length ? (
					<div className='divide-y'>{expenses.map(item => <ExpenseCard key={item.id} expense={item} onEdit={selected => { setEditingExpense(selected); setIsModalOpen(true) }} />)}</div>
				) : (
					<div className='flex min-h-52 flex-col items-center justify-center px-5 text-center'><div className='mb-3 flex size-12 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#536BE8] dark:bg-[#6A81FF]/15'><ReceiptText className='size-6' /></div><p className='font-medium'>Xarajat topilmadi</p><p className='mt-1 text-sm text-muted-foreground'>{from || to ? 'Sana oralig‘ini o‘zgartiring yoki filterni tozalang.' : 'Yangi xarajat qo‘shilganda shu yerda ko‘rinadi.'}</p></div>
				)}
			</section>

			<PaginationContyent currentPage={currentPage} setPostPerPage={value => { setPostsPerPage(value); setCurrentPage(1) }} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} totalPosts={expensesData?.total || 0} pagesSize={[10, 20, 30, 50]} />

			<EditExpenseModal expense={editingExpense} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingExpense(null) }} onSave={item => editExpenses.mutate({ definition: item.definition, expense_type_id: Number(item.expense_type_id), id: item.id, price: item.price })} />
		</div>
	)
}

export default ExpensesTable

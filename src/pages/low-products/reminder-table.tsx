import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import PaginationContyent from '@/components/_components/pagination'
import ProductsTableSkeleton from '../pruducts/product-skeleton'
import { product } from '@/@types'
import { Button } from '@/components/ui/button'
import { reminderUtils } from '@/utils/reminder'
import AddReminder from './add-reminder'
import EditReminder from './edit-reminder'
import { DeleteConfirm } from '@/components/ui/alerd-dialog'
import toast from 'react-hot-toast'

const ReminderTable = () => {
	const [postsPerPage, setPostsPerPage] = useState<number>(5)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const queryClient = useQueryClient()
	const { data: reminderProducts, isLoading } = useQuery({
		queryKey: ['get_reminder_products', currentPage, postsPerPage],
		queryFn: async () =>
			await reminderUtils.getReminder({
				limit: postsPerPage,
				page: currentPage,
			}),
		placeholderData: keepPreviousData,
	})
	const totalPages = Math.max(
		1,
		Math.ceil((reminderProducts?.total || 1) / postsPerPage),
	)
	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(1)
	}, [currentPage, totalPages])

	const paginated = reminderProducts?.data
	const downloadMutation = useMutation({
		mutationFn: reminderUtils.getProductExport,
		onSuccess: response => {
			const blob = new Blob([response], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url

			link.setAttribute(
				'download',
				`mahsulotlar_hisoboti_${new Date().toLocaleDateString()}.xlsx`,
			)
			document.body.appendChild(link)
			link.click()
			window.URL.revokeObjectURL(url)
		},
	})
	const deleteProduct = useMutation({
		mutationFn: reminderUtils.deleteReminderProduct,
		onSuccess: () => {
			toast.success("Mahsulot o'chirildi.")
			queryClient.invalidateQueries({ queryKey: ['get_reminder_products'] })
		},
		onError: err => {
			console.log(err)
		},
	})

	const renderCell = (value: any, suffix: string = '') => {
		if (value === null || value === undefined || value === '') {
			return <span className='text-muted-foreground/40 font-normal'>—</span>
		}
		return `${value.toLocaleString()}${suffix}`
	}

	return (
		<div className='p-2 mt-4'>
			<Table className='overflow-hidden rounded-xl'>
				<TableHeader className='bg-muted/50'>
					<TableRow className='bg-muted/50 hover:bg-muted/50 border-b'>
						<TableHead className='w-[60px] font-semibold'>№</TableHead>
						<TableHead className='font-semibold'>Nomi</TableHead>
						<TableHead className='font-semibold'>Tan narxi (uzs)</TableHead>
						<TableHead className='font-semibold'>Sotuv narxi (uzs)</TableHead>
						<TableHead className='font-semibold'>USD kursi</TableHead>
						<TableHead className='font-semibold'>Miqdori</TableHead>
						<TableHead className='font-semibold'>O'lchov</TableHead>
						<TableHead className='text-center font-semibold'>Amallar</TableHead>
					</TableRow>
				</TableHeader>
				{isLoading ? (
					<ProductsTableSkeleton />
				) : (paginated?.length ?? 0) > 0 ? (
					<TableBody>
						{paginated?.map((el: product, index: number) => (
							<TableRow
								key={el.id}
								className='hover:bg-muted/40 transition-colors'
							>
								<TableCell className='text-muted-foreground'>
									#{(currentPage - 1) * postsPerPage + index + 1}
								</TableCell>

								{/* Nomi har doim aniq */}
								<TableCell className='font-semibold text-foreground max-w-[200px] truncate'>
									{el.name}
								</TableCell>

								{/* Narxlar va Kurs uchun renderCell ishlatamiz */}
								<TableCell className='text-sm'>
									{renderCell(el.cost_price, " so'm")}
								</TableCell>

								<TableCell className='font-medium text-sm'>
									{renderCell(el.sale_price)}
								</TableCell>

								<TableCell className='text-muted-foreground text-sm'>
									{renderCell(el.usd_rate)}
								</TableCell>

								{/* Miqdor uchun Badge dizayni */}
								<TableCell className='text-center'>
									{el.quantity !== undefined && el.quantity !== null ? (
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
												el.quantity > 10
													? 'bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400'
													: el.quantity > 0
														? 'bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
														: 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400'
											}`}
										>
											{el.quantity}
										</span>
									) : (
										renderCell(null)
									)}
								</TableCell>

								<TableCell className='capitalize text-muted-foreground text-sm'>
									{el.unit?.name || renderCell(null)}
								</TableCell>

								<TableCell>
									<div className='flex gap-x-2 justify-center items-center'>
										<EditReminder id={el.id} />
										<DeleteConfirm
											onConfirm={() => deleteProduct.mutate(el.id)}
										/>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				) : (
					<TableBody>
						<TableRow>
							<TableCell colSpan={8} className='h-32 text-center'>
								<div className='flex flex-col items-center justify-center text-muted-foreground gap-2'>
									<span className='text-3xl'>📦</span>
									<p>Hozircha mahsulotlar mavjud emas</p>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				)}
			</Table>

			<PaginationContyent
				currentPage={currentPage}
				setPostPerPage={n => {
					setPostsPerPage(n)
					setCurrentPage(1)
				}}
				postsPerPage={postsPerPage}
				setCurrentPage={n => setCurrentPage(n)}
				totalPosts={reminderProducts?.total || 0}
			/>
		</div>
	)
}

export default ReminderTable

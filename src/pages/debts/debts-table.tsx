import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Search, Send } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { debtsUtils } from '@/utils/debts'
import { sotreDebts } from '@/@types'
import { Button } from '@/components/ui/button'
import PaginationContyent from '@/components/_components/pagination'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/components/functions/useDebounce'
import DebtsTableSkeleton from './debts-skeleton'
import { Link } from 'react-router-dom'

const DebtsTable = () => {
	const [postsPerPage, setPostsPerPage] = useState<number>(5)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebounce(search)
	const { data: debts, isLoading } = useQuery({
		queryKey: ['debts_all', postsPerPage, currentPage, debouncedSearch],
		queryFn: async () =>
			await debtsUtils.getDebts({
				limit: postsPerPage,
				page: currentPage,
				search: debouncedSearch,
			}),
	})
	const totalPages = Math.max(1, Math.ceil((debts?.total || 1) / postsPerPage))

	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(1)
	}, [currentPage, totalPages])

	const paginated = debts?.data || []

	console.log(paginated)

	return (
		<div className='mt-5'>
			<div className='relative w-full sm:w-[450px] my-2'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
				<Input
					type='search'
					placeholder='Qidirish...'
					value={search}
					onChange={e => setSearch(e.target.value)}
					className='h-12 pl-10 bg-background'
				/>
			</div>
			<div className='border rounded-xl overflow-hidden bg-card'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/50 hover:bg-muted/50 border-b'>
							<TableHead className='w-[120px] font-semibold'>
								Buyurtma
							</TableHead>
							<TableHead className='font-semibold'>Mijoz</TableHead>
							<TableHead className='font-semibold'>Telefon raqam</TableHead>
							<TableHead className='font-semibold'>Umumiy narx</TableHead>
						</TableRow>
					</TableHeader>
					{isLoading ? (
						<DebtsTableSkeleton />
					) : (paginated?.length ?? 0) > 0 ? (
						<TableBody>
							{paginated?.map((el: sotreDebts, idx: number) => (
								<TableRow
									key={idx}
									className='hover:bg-muted/50 transition-colors'
								>
									<TableCell className='font-medium'>#{el.user_id}</TableCell>
									<TableCell className='text-muted-foreground'>
										<Link
											to={`/debts-histore/${el.user_id}`}
											className='hover:text-blue-500 hover:underline transition-colors'
										>
											{el.client.name}
										</Link>
									</TableCell>
									<TableCell className='text-foreground'>
										+{el.client.phone}
									</TableCell>
									<TableCell className='font-medium text-red-400'>
										{el?.total_amount?.toLocaleString()} so'm
									</TableCell>
									<TableCell className='text-muted-foreground'>
										{/* {el.reminder} */}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex gap-x-3 justify-center items-center'>
											{/* <EditDepts {...el} /> */}
											{/* <DeleteConfirm onConfirm={() => deleteMutation.mutate(el.id || '1')} /> */}
											<Button variant='outline' size='sm' className='gap-2'>
												Xabar yuborish
												<Send size={16} />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					) : (
						<TableBody>
							<TableRow>
								<TableCell
									colSpan={5}
									className='h-24 text-center text-muted-foreground'
								>
									Qarzlar topilmadi
								</TableCell>
							</TableRow>
						</TableBody>
					)}
				</Table>
			</div>
			<PaginationContyent
				currentPage={currentPage}
				setPostPerPage={n => {
					setPostsPerPage(n)
					setCurrentPage(1)
				}}
				postsPerPage={postsPerPage}
				setCurrentPage={n => setCurrentPage(n)}
				totalPosts={debts?.total || 0}
			/>
		</div>
	)
}

export default DebtsTable

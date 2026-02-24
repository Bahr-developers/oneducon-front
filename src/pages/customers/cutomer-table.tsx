import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { customerType, customerUtils } from '@/utils/customer'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import EditCustomer from './edit-cust'
import toast from 'react-hot-toast'
import { DeleteConfirm } from '@/components/ui/alerd-dialog'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { useQueryParams } from '@/hooks/query-params'
import { useDebounce } from '@/hooks/useDebounce'
import PaginationContyent from '@/components/_components/pagination'

const CustomerTableSkeleton = () => {
	return (
		<TableBody>
			{[...Array(5)].map((_, i) => (
				<TableRow key={i}>
					<TableCell>
						<Skeleton className='h-5 w-24' />
					</TableCell>
					<TableCell>
						<Skeleton className='h-5 w-32' />
					</TableCell>
					<TableCell className='text-right'>
						<div className='flex gap-x-5 justify-center items-center'>
							<Skeleton className='h-8 w-8 rounded' />
							<Skeleton className='h-8 w-8 rounded' />
						</div>
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	)
}

const CustomeTable = () => {
	const { updateURL, getParam } = useQueryParams()

	const [postsPerPage, setPostsPerPage] = useState<number>(() =>
		parseInt(getParam('limit', '5')),
	)
	const [currentPage, setCurrentPage] = useState<number>(() =>
		parseInt(getParam('page', '1')),
	)
	const [searchQuery, setSearchQuery] = useState<string>(() =>
		getParam('search', ''),
	)

	const debouncedSearch = useDebounce(searchQuery, 500)

	useEffect(() => {
		updateURL({
			limit: postsPerPage,
			page: currentPage,
			search: debouncedSearch,
		})
	}, [currentPage, debouncedSearch, postsPerPage, updateURL])
	const { data: customers, isLoading } = useQuery({
		queryKey: ['customers', postsPerPage, currentPage, searchQuery],
		queryFn: async () =>
			await customerUtils.getCustomer({
				limit: postsPerPage,
				page: currentPage,
				search: searchQuery,
			}),
	})
	const queryClient = useQueryClient()

	const deleteCustomer = useMutation({
		mutationFn: customerUtils.deleteCustomer,
		onSuccess: data => {
			toast.success(data.message)
			queryClient.invalidateQueries({ queryKey: ['customers'] })
		},
		onError: err => {
			toast.error('error')
			console.log(err)
		},
	})

	return (
		<div className='my-4'>
			<div className='relative w-full sm:w-[450px] mb-3'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
				<Input
					type='search'
					placeholder='Qidirish...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='h-12 pl-10 bg-background'
				/>
			</div>
			<div className='border rounded-xl overflow-hidden bg-card'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/50 hover:bg-muted/50 border-b'>
							<TableHead className='w-[120px] font-semibold'>Ismi</TableHead>
							<TableHead className='font-semibold'>Telefon raqami</TableHead>
							<TableHead className='text-right font-semibold'>
								Amallar
							</TableHead>
						</TableRow>
					</TableHeader>
					{isLoading ? (
						<CustomerTableSkeleton />
					) : customers?.data?.length > 0 ? (
						<TableBody>
							{customers.data.map((el: customerType) => (
								<TableRow
									key={el.id}
									className='hover:bg-muted/50 transition-colors'
								>
									<TableCell className='capitalize font-medium'>
										{el.name}
									</TableCell>
									<TableCell className='text-muted-foreground'>
										{el.phone}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex gap-x-3 justify-center items-center'>
											<EditCustomer customer={el} />
											<DeleteConfirm
												onConfirm={() => deleteCustomer.mutate(el.id || '1')}
											/>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					) : (
						<TableBody>
							<TableRow>
								<TableCell
									colSpan={3}
									className='h-24 text-center text-muted-foreground'
								>
									Mijozlar topilmadi
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
				totalPosts={customers?.total || 0}
			/>
		</div>
	)
}

export default CustomeTable

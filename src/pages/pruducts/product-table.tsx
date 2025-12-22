import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import EditProsucts from './edit-products'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productUtils } from '@/utils/products'
import { categoryType, product } from '@/types'
import { categoryUtils } from '@/utils/categories'
import ProductView from './product-view'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import PaginationContyent from '@/components/_components/pagination'
import { useDebounce } from '@/components/functions/useDebounce'
import { useQueryParams } from '@/components/functions/query-params'
import ProductsTableSkeleton from './product-skeleton'
import toast from 'react-hot-toast'
import { DeleteConfirm } from '@/components/ui/alerd-dialog'
import { Button } from '@/components/ui/button'
import { AxiosError } from 'axios'

const Productstable = () => {
	const { updateURL, getParam } = useQueryParams()
	const queryClient = useQueryClient()
	// URL dan qiymatlarni olish
	const [postsPerPage, setPostsPerPage] = useState<number>(() =>
		parseInt(getParam('limit', '5'))
	)
	const [currentPage, setCurrentPage] = useState<number>(() =>
		parseInt(getParam('page', '1'))
	)
	const [searchQuery, setSearchQuery] = useState<string>(() =>
		getParam('search', '')
	)
	const [selectedCategory, setSelectedCategory] = useState<string>(() =>
		getParam('category', '')
	)

	const removeParam = (key: string) => {
		const url = new URL(window.location.href)
		url.searchParams.delete(key)
		window.history.replaceState({}, '', url.toString())
	}
	const debouncedSearch = useDebounce(searchQuery, 500)
	const { data: procusts, isLoading } = useQuery<{
		data: product[]
		total: number
	}>({
		queryKey: [
			'get_all_procusts',
			debouncedSearch,
			selectedCategory,
			postsPerPage,
			currentPage,
		],
		queryFn: async () =>
			await productUtils.getProducts({
				limit: postsPerPage,
				page: currentPage,
				search: debouncedSearch,
				category: selectedCategory,
			}),
	})

	useEffect(() => {
		updateURL({
			search: debouncedSearch,
			category: selectedCategory,
			page: currentPage?.toString(),
			limit: postsPerPage?.toString(),
		})
	}, [debouncedSearch, selectedCategory, currentPage, postsPerPage, updateURL])

	const { data: categories, isLoading: categoriesLoading } = useQuery({
		queryKey: ['get_all_categories'],
		queryFn: categoryUtils.getCategory,
	})

	const paginated = procusts?.data

	const deleteProduct = useMutation({
		mutationFn: productUtils?.deleteProduct,
		onSuccess: () => {
			toast.success("Mahsulot o'chirildi.")
			queryClient.invalidateQueries({ queryKey: ['get_all_procusts'] })
		},
		onError: err => {
			console.log(err)
		},
	})

	const downloadMutation = useMutation({
		mutationFn: () =>
			productUtils.getProductExport({
				categoryId: selectedCategory == '' ? null : selectedCategory,
				search: searchQuery,
			}),
		onSuccess: response => {
			const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
			const url = window.URL.createObjectURL(blob)

			const a = document.createElement('a')
			a.href = url
			a.download = 'low-products.xlsx'
			a.click()

			window.URL.revokeObjectURL(url)
		},
		onError: err => {
			const error = err as AxiosError<{ message: string }>
			toast(error.response?.data.message || 'Something went wrong')
			console.log(error)
		},
	})

	return (
		<div className='mt-4'>
			<div className='border rounded-xl p-4 bg-card'>
				<div className='flex my-4 justify-between gap-4 flex-wrap'>
					<div className='relative w-full sm:w-[450px]'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							type='search'
							placeholder='Qidirish...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='h-12 pl-10 bg-background'
						/>
					</div>
					<div className='flex items-center gap-x-2'>
						<Button
							className='cursor-pointer h-12'
							onClick={() => downloadMutation?.mutate()}
							disabled={downloadMutation?.isPending}
						>
							{downloadMutation?.isPending
								? 'Yuklanmoqda...'
								: 'Excel yuklab olish'}
						</Button>
						<Select
							value={selectedCategory}
							onValueChange={value => {
								if (value === 'all') {
									removeParam('category')
									setSelectedCategory('')
								} else {
									setSelectedCategory(value)
								}
							}}
						>
							<SelectTrigger className='w-full sm:w-[280px] h-11'>
								<SelectValue placeholder='Barchasi' />
							</SelectTrigger>
							<SelectContent>
								{categoriesLoading ? (
									<div className='p-2'>
										<Skeleton className='h-8 w-full' />
									</div>
								) : (
									<>
										<SelectItem value={'all'}>{'Barchasi'}</SelectItem>
										{categories?.data?.map((el: categoryType) => (
											<SelectItem value={el?.id} key={el?.id}>
												{el?.name}
											</SelectItem>
										))}
									</>
								)}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className='rounded-lg border overflow-hidden'>
					<Table>
						<TableHeader>
							<TableRow className='bg-muted/50 hover:bg-muted/50 border-b'>
								<TableHead className='w-[60px] font-semibold'>№</TableHead>
								<TableHead className='font-semibold'>Nomi</TableHead>
								<TableHead className='font-semibold'>Tan narxi (uzs)</TableHead>
								<TableHead className='font-semibold'>
									Sotuv narxi (uzs)
								</TableHead>
								<TableHead className='font-semibold'>USD kursi</TableHead>
								<TableHead className='font-semibold'>Miqdori</TableHead>
								<TableHead className='font-semibold'>O'lchov</TableHead>
								<TableHead className='text-center font-semibold'>
									Amallar
								</TableHead>
							</TableRow>
						</TableHeader>
						{isLoading ? (
							<ProductsTableSkeleton />
						) : (paginated?.length ?? 0) > 0 ? (
							<TableBody>
								{paginated?.map((el: product, index: number) => (
									<TableRow
										key={el?.id}
										className='hover:bg-muted/50 transition-colors'
									>
										<TableCell className='font-medium text-muted-foreground'>
											#{index + 1}
										</TableCell>
										<TableCell className='font-medium'>{el?.name}</TableCell>
										<TableCell className='text-muted-foreground'>
											{el?.cost_price?.toLocaleString()}
										</TableCell>
										<TableCell className='font-medium'>
											{el?.sale_price?.toLocaleString()}
										</TableCell>
										<TableCell className='font-medium'>
											{el?.usd_rate?.toLocaleString()}
										</TableCell>
										<TableCell>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													el?.quantity > 10
														? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
														: el?.quantity > 0
														? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
														: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
												}`}
											>
												{el?.quantity}
											</span>
										</TableCell>
										<TableCell className='capitalize text-muted-foreground'>
											{el?.unit?.name}
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex gap-x-4 justify-center  items-center'>
												<EditProsucts product={el} />
												<ProductView {...el} />
												<DeleteConfirm
													onConfirm={() => deleteProduct.mutate(el?.id)}
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
										colSpan={7}
										className='h-24 text-center text-muted-foreground'
									>
										Mahsulotlar topilmadi
									</TableCell>
								</TableRow>
							</TableBody>
						)}
					</Table>
				</div>
			</div>
			<PaginationContyent
				currentPage={currentPage}
				setPostPerPage={n => {
					setPostsPerPage(n)
					setCurrentPage(1)
				}}
				postsPerPage={postsPerPage}
				setCurrentPage={n => setCurrentPage(n)}
				totalPosts={procusts?.total || 0}
			/>
		</div>
	)
}

export default Productstable

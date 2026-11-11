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
import { Input } from '@/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productUtils } from '@/utils/products'
import type { categoryType, product } from '@/@types'
import { categoryUtils } from '@/utils/categories'
import { ChevronRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import PaginationContyent from '@/components/_components/pagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useQueryParams } from '@/hooks/query-params'
import ProductsTableSkeleton from './product-skeleton'
import toast from 'react-hot-toast'
import { DeleteConfirm } from '@/components/ui/alerd-dialog'
import { Button } from '@/components/ui/button'
import { AxiosError } from 'axios'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	clearProductSelection,
	deselectProducts,
	selectProducts,
	updateSelectedLabels,
} from '@/store/product-selection-slice'
import { setPostsPerPage } from '@/store/paginationSlice.ts'
import { Link } from 'react-router-dom'
import BarcodePrintDialog from './barcode-print-dialog'

const Productstable = () => {
	const { updateURL, getParam, searchParams } = useQueryParams()
	const queryClient = useQueryClient()
	const dispatch = useAppDispatch()
	const postsPerPage = useAppSelector(state => state.pagination.postsPerPage)
	const selection = useAppSelector(state => state.productSelection)
	const selectedProducts = useMemo(() => Object.values(selection), [selection])
	const [currentPage, setCurrentPage] = useState(() => {
		const page = Number(getParam('page', '1'))
		return Number.isSafeInteger(page) && page > 0 ? page : 1
	})
	const [searchQuery, setSearchQuery] = useState<string>(() =>
		getParam('search', ''),
	)
	const [selectedCategory, setSelectedCategory] = useState<string>(() =>
		getParam('category', ''),
	)

	const debouncedSearch = useDebounce(searchQuery.trim(), 500)
	const isSearching = debouncedSearch !== searchQuery.trim()

	const { data: products, isLoading, isFetching, isError } = useQuery<{
		data: product[]
		total: number
	}>({
		queryKey: [
			'get_all_products',
			debouncedSearch,
			selectedCategory,
			postsPerPage,
			currentPage,
		],
		enabled: !isSearching,
		queryFn: () =>
			productUtils.getProducts({
				limit: postsPerPage,
				page: currentPage,
				search: debouncedSearch,
				category: selectedCategory,
			}),
	})

	useEffect(() => {
		if (isSearching) return

		const params = {
			search: debouncedSearch,
			category: selectedCategory,
			page: String(currentPage),
			limit: String(postsPerPage),
		}
		if (Object.entries(params).some(([key, value]) => (searchParams.get(key) ?? '') !== value)) {
			updateURL(params)
		}
	}, [isSearching, debouncedSearch, selectedCategory, currentPage, postsPerPage, searchParams, updateURL])

	useEffect(() => {
		if (products && !isFetching && !isSearching && !isError) {
			dispatch(updateSelectedLabels(products.data.map(({ id, name, barcode }) => ({
				id, name, barcode: barcode ?? null,
			}))))
		}
	}, [products, isFetching, isSearching, isError, dispatch])

	const { data: categories, isLoading: categoriesLoading } = useQuery({
		queryKey: ['get_all_categories'],
		queryFn: categoryUtils.getCategory,
	})

	const paginated = isSearching ? [] : products?.data ?? []
	const selectedOnPage = paginated.filter(item => selection[item.id]).length
	const pageChecked = selectedOnPage > 0 && (selectedOnPage === paginated.length || 'indeterminate')
	const setProductsChecked = (items: product[], checked: boolean) => {
		dispatch(checked ? selectProducts(items) : deselectProducts(items.map(item => item.id)))
	}

	const deleteCheckProduct = useMutation({
		mutationFn: productUtils.deleteBulk,
		onSuccess: (_, deletedIds) => {
			toast.success("Mahsulotlar o'chirildi.")
			queryClient.invalidateQueries({ queryKey: ['get_all_products'] })
			dispatch(deselectProducts(deletedIds))
			setCurrentPage(1)
		},
		onError: () => toast.error('Tanlangan mahsulotlarni o‘chirib bo‘lmadi'),
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
							aria-label='Mahsulotlarni qidirish'
							placeholder='Qidirish...'
							value={searchQuery}
							onChange={e => {
								setSearchQuery(e.target.value)
								setCurrentPage(1)
							}}
							className='h-12 pl-10 bg-background'
						/>
					</div>

					<div className='flex flex-wrap items-center gap-2'>

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
							value={selectedCategory || 'all'}
							onValueChange={value => {
								setSelectedCategory(value === 'all' ? '' : value)
								setCurrentPage(1)
							}}
						>
							<SelectTrigger aria-label='Kategoriya bo‘yicha filtrlash' className='w-full sm:w-[280px] h-11'>
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

				<div className='mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2'>
					<p className='text-sm text-muted-foreground' role='status'>
						<span className='font-medium tabular-nums text-foreground'>{selectedProducts.length}</span> ta mahsulot tanlangan
					</p>
					<div className='flex flex-wrap items-center gap-2'>
						{selectedProducts.length > 0 && (
							<>
								<Button variant='ghost' size='sm' onClick={() => dispatch(clearProductSelection())}>
									Tanlovni tozalash
								</Button>
								<DeleteConfirm
									title='O‘chirish'
									disabled={deleteCheckProduct.isPending}
									description={`Barcha sahifalardan tanlangan ${selectedProducts.length} ta mahsulot o‘chiriladi.`}
									onConfirm={() => deleteCheckProduct.mutate(Object.keys(selection))}
								/>
							</>
						)}
						<BarcodePrintDialog
							products={selectedProducts}
							disabled={!selectedProducts.length || deleteCheckProduct.isPending}
							onRemove={id => dispatch(deselectProducts([id]))}
						/>
					</div>
				</div>

				<div className='rounded-lg border overflow-hidden'>
					<Table>
						<TableHeader>
							<TableRow className='bg-muted/50 hover:bg-muted/50 border-b'>
								<TableHead className='w-[50px]'>
									<Checkbox
										checked={pageChecked}
										disabled={paginated.length === 0}
									onCheckedChange={checked => setProductsChecked(paginated, checked === true)}
										aria-label='Joriy sahifadagi mahsulotlarni tanlash'
										className='border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
									/>
								</TableHead>
								<TableHead className='w-[60px] font-semibold'>№</TableHead>
								<TableHead className='font-semibold'>Nomi</TableHead>
								<TableHead className='font-semibold'>
									Ulgurji narxi (uzs)
								</TableHead>
								<TableHead className='font-semibold'>Tan narxi (uzs)</TableHead>
								<TableHead className='font-semibold'>
									Sotuv narxi (uzs)
								</TableHead>
								<TableHead className='font-semibold'>USD kursi</TableHead>
								<TableHead className='font-semibold'>Miqdori</TableHead>
								<TableHead className='font-semibold'>O&apos;lchov</TableHead>
								<TableHead className='text-center font-semibold'>
									Batafsil
								</TableHead>
							</TableRow>
						</TableHeader>

						{isLoading || isSearching ? (
							<ProductsTableSkeleton />
						) : paginated.length > 0 ? (
							<TableBody>
								{paginated.map((el: product, index: number) => (
									<TableRow
										key={el?.id}
										data-state={selection[el.id] ? 'selected' : undefined}
										className='hover:bg-muted/50 transition-colors'
									>
										<TableCell>
											<Checkbox
												checked={Boolean(selection[el.id])}
												onCheckedChange={checked => setProductsChecked([el], checked === true)}
												aria-label={`${el.name} ni tanlash`}
												className='border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
											/>
										</TableCell>

										<TableCell className='font-medium text-muted-foreground'>
											#{index + 1}
										</TableCell>
										<TableCell className='font-medium'>{el?.name}</TableCell>
										<TableCell className='text-muted-foreground'>
											{el?.wholesale_price
												? el?.wholesale_price?.toLocaleString()
												: el?.cost_price?.toLocaleString()}
										</TableCell>
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
											<Button variant='ghost' size='sm' asChild className='text-[#536BE8] hover:bg-[#EEF1FF] hover:text-[#4359C5] dark:hover:bg-[#6A81FF]/15'>
												<Link to={`/dashboard/products/${el.id}`}>
													Ko‘rish <ChevronRight />
												</Link>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						) : (
							<TableBody>
								<TableRow>
									<TableCell
										colSpan={10}
										className='h-24 text-center text-muted-foreground'
									>
										{isError ? 'Mahsulotlarni yuklab bo‘lmadi' : 'Mahsulotlar topilmadi'}
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
					dispatch(setPostsPerPage(n))
					setCurrentPage(1)
				}}
				postsPerPage={postsPerPage}
				setCurrentPage={n => setCurrentPage(n)}
				totalPosts={isSearching ? 0 : products?.total ?? 0}
			/>
		</div>
	)
}

export default Productstable

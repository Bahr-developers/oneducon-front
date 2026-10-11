import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronRight, HandCoins } from 'lucide-react'
import FilterData from './filter-data'
import { useQuery } from '@tanstack/react-query'
import { orderUtils } from '@/utils/orders'
import { order } from '@/@types'
import PaginationContyent from '@/components/_components/pagination'
import { useEffect, useMemo, useState } from 'react'
import { useQueryParams } from '@/hooks/query-params'
import { useDebounce } from '@/hooks/useDebounce'
import { Badge } from '@/components/ui/badge'
import SelesTableSkeleton from './seles-table-skeleton'
import { formatLocalDate } from '@/components/functions/format-locale-date'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { setPostsPerPage } from '@/store/paginationSlice.ts'
import { Link } from 'react-router-dom'

function parseDateParam(value: string) {
	if (!value) return undefined
	const [year, month, day] = value.split('-').map(Number)
	if (!year || !month || !day) return undefined
	return new Date(year, month - 1, day)
}

const SalesTable = () => {
	const { updateURL, getParam } = useQueryParams()
	const dispatch = useDispatch()
	const [from, setFrom] = useState<Date | undefined>(() => {
		return parseDateParam(getParam('from', ''))
	})

	const [to, setTo] = useState<Date | undefined>(() => {
		return parseDateParam(getParam('to', ''))
	})

	const [client, setClient] = useState<string>(() => getParam('client', ''))
	const [paymentType, setPaymentType] = useState<string>(() =>
		getParam('paymentType', ''),
	)

	const postsPerPage = useSelector(
		(state: RootState) => state.pagination.postsPerPage,
	)

	const [currentPage, setCurrentPage] = useState<number>(() =>
		parseInt(getParam('page', '1')),
	)

	const [searchQuery, setSearchQuery] = useState<string>(() =>
		getParam('search', ''),
	)

	const debouncedSearch = useDebounce(searchQuery, 500)

	const backendFrom = useMemo(() => {
		if (!from) return undefined
		const d = new Date(from)
		d.setHours(0, 0, 0, 0)
		return d
	}, [from])

	const backendTo = useMemo(() => {
		if (!to) return undefined
		const d = new Date(to)
		d.setHours(0, 0, 0, 0)
		d.setDate(d.getDate() + 1)
		return d
	}, [to])

	useEffect(() => {
		setCurrentPage(1)
	}, [debouncedSearch, client, paymentType, from, to])

	useEffect(() => {
		updateURL({
			search: debouncedSearch,
			page: currentPage.toString(),
			limit: postsPerPage.toString(),
			client: client || '',
			paymentType: paymentType || '',
			from: from ? formatLocalDate(from) : '',
			to: to ? formatLocalDate(to) : '',
		})
	}, [
		debouncedSearch,
		currentPage,
		postsPerPage,
		client,
		paymentType,
		from,
		to,
		updateURL,
	])

	const { data: sales, isLoading } = useQuery<{ data: order[]; total: number }>(
		{
			queryKey: [
				'get_all_orders',
				debouncedSearch,
				client,
				paymentType,
				backendFrom?.toISOString(),
				backendTo?.toISOString(),
				postsPerPage,
				currentPage,
			],
			queryFn: async () =>
				await orderUtils.getOrders({
					limit: postsPerPage,
					page: currentPage,
					search: debouncedSearch,
					client: client || undefined,
					payment_type: paymentType || undefined,
					from: backendFrom?.toISOString(),
					to: backendTo?.toISOString(),
				}),
		},
	)

	const resetFilter = () => {
		setFrom(undefined)
		setTo(undefined)
		setClient('')
		setPaymentType('')
		setSearchQuery('')
		setCurrentPage(1)

		updateURL({
			search: '',
			client: '',
			paymentType: '',
			from: '',
			to: '',
			page: '1',
		})
	}

	const paginated = sales?.data

	const isFilterActive =
		!!from || !!to || !!client || !!paymentType || !!searchQuery

	return (
		<div className='mt-10'>
			<div className='mb-5 rounded-xl border bg-background p-3'>
				<FilterData
					from={from}
					setFrom={setFrom}
					to={to}
					setTo={setTo}
					client={client}
					setClient={setClient}
					paymentType={paymentType}
					setPaymentType={setPaymentType}
					hasActiveFilter={isFilterActive}
					onClear={resetFilter}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
			</div>

			<div className='border rounded-xl overflow-hidden bg-card'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/50 hover:bg-muted/50 border-b'>
							<TableHead className='w-[100px] font-semibold'>№</TableHead>
							<TableHead className='font-semibold'>Mahsulotlar</TableHead>
							<TableHead className='font-semibold'>Xaridor</TableHead>
							<TableHead className='font-semibold'>Umumiy narxi</TableHead>
							<TableHead className='font-semibold'>
								To&apos;langan narxi
							</TableHead>
							<TableHead className='font-semibold'>Qarzdorlik narxi</TableHead>
							<TableHead className='font-semibold'>Yaratilgan sana</TableHead>
							<TableHead className='text-center font-semibold'>
								Batafsil
							</TableHead>
						</TableRow>
					</TableHeader>

					{isLoading ? (
						<SelesTableSkeleton />
					) : (paginated?.length ?? 0) > 0 ? (
						<TableBody>
							{paginated?.map(el => {
								const totalPayments =
									el?.payments?.reduce(
										(sum, p) => sum + (p.price || p.amount || 0),
										0,
									) || 0

								const remainingDebt = el?.total_price - totalPayments

								return (
									<TableRow
										key={el.id}
										className='hover:bg-muted/50 transition-colors'
									>
										<TableCell className='font-medium'>
											#{el.order_number}
										</TableCell>

										<TableCell>
											<ul className='list-decimal pl-5 space-y-0.5'>
												{el.order_items.slice(0, 3).map((item, index, arr) => (
													<li key={item.product.id}>
														{item.product.name}
														<span title='Mahsulotlar yana mavjud'>
															{index === arr.length - 1 &&
															el.order_items.length > 3
																? ' ...'
																: ''}
														</span>
													</li>
												))}
											</ul>
										</TableCell>

										<TableCell className='font-medium'>
											{el.client?.name || "Noma'lum"}
										</TableCell>

										<TableCell>
											<span className='font-semibold text-green-600 dark:text-green-400'>
												{el.total_price?.toLocaleString()} so&apos;m
											</span>
										</TableCell>

										<TableCell>
											<span className='font-semibold text-blue-600 dark:text-blue-400'>
												{totalPayments?.toLocaleString()} so&apos;m
											</span>
										</TableCell>

										<TableCell>
											<div className='font-semibold text-green-600 dark:text-green-400 relative'>
												{remainingDebt > 0 && remainingDebt?.toLocaleString()}{' '}
												{remainingDebt > 0 && "so'm"}
												<Badge
													variant={
														remainingDebt > 0 ? 'destructive' : 'default'
													}
													className={`${
														remainingDebt > 0
															? 'text-[9px] absolute -top-2'
															: 'text-sm'
													}`}
												>
													{remainingDebt > 0 ? 'Qarzli' : "To'liq to'langan"}
												</Badge>
											</div>
										</TableCell>

										<TableCell className='text-muted-foreground'>
											{el.created_at
												? new Date(el.created_at).toLocaleDateString('uz-UZ')
												: '-'}
										</TableCell>

										<TableCell className='text-right'>
											<Button variant='ghost' size='sm' asChild className='text-[#536BE8] hover:bg-[#EEF1FF] hover:text-[#4359C5] dark:hover:bg-[#6A81FF]/15'>
												<Link to={`/dashboard/selers/${el.id}`}>Ko‘rish <ChevronRight /></Link>
											</Button>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					) : (
						<TableBody>
							<TableRow>
								<TableCell colSpan={8} className='h-32 text-center'>
									<div className='flex flex-col items-center justify-center text-muted-foreground'>
										<HandCoins className='h-12 w-12 mb-2 opacity-50' />
										<p className='text-sm'>Savdolar topilmadi</p>
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					)}
				</Table>
			</div>

			<PaginationContyent
				currentPage={currentPage}
				setPostPerPage={n => {
					dispatch(setPostsPerPage(n))
					setCurrentPage(1)
				}}
				postsPerPage={postsPerPage}
				setCurrentPage={n => setCurrentPage(n)}
				totalPosts={sales?.total || 0}
			/>
		</div>
	)
}

export default SalesTable

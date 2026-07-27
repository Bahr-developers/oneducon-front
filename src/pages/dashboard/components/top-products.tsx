import { ArrowRight, Box } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useDashboardCurrency } from '../hooks/use-dashboard-currency'
import { useTopProducts } from '../hooks/use-top-products'
import { formatCompactMoney, toDisplayAmount } from '../lib/format'
import { DashboardEmpty, DashboardError } from './dashboard-states'
import { DashboardWidget } from './dashboard-widget'
import { ListSkeleton } from './skeletons/dashboard-skeletons'

export function TopProducts() {
	const { currency } = useDashboardCurrency()
	const { data, isLoading, isError } = useTopProducts()

	return (
		<DashboardWidget
			title='Top mahsulotlar'
			action={
				<Link
					to='/dashboard/products'
					className='inline-flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-[#5C59E8] hover:underline'
				>
					Barchasi
					<ArrowRight className='size-3' />
				</Link>
			}
			contentClassName='overflow-x-auto px-0 pb-2'
		>
			{isLoading ? (
				<div className='px-3'>
					<ListSkeleton />
				</div>
			) : isError ? (
				<div className='px-3'>
					<DashboardError />
				</div>
			) : !data?.length ? (
				<div className='px-3'>
					<DashboardEmpty />
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow className='hover:bg-transparent'>
							<TableHead className='h-8 w-8 pl-3 text-[11px]'>#</TableHead>
							<TableHead className='h-8 text-[11px]'>Mahsulot</TableHead>
							<TableHead className='h-8 text-[11px]'>Miqdor</TableHead>
							<TableHead className='h-8 pr-3 text-right text-[11px]'>
								Summa
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((product, index) => (
							<TableRow key={product.productId} className='border-border/60'>
								<TableCell className='py-1.5 pl-3 text-[11px] text-muted-foreground'>
									{index + 1}
								</TableCell>
								<TableCell className='max-w-[120px] py-1.5'>
									<div className='flex min-w-0 items-center gap-1.5'>
										<span className='inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-[#5C59E8]/10 text-[#5C59E8]'>
											<Box className='size-3' />
										</span>
										<span className='truncate text-[11px] font-medium'>
											{product.productName}
										</span>
									</div>
								</TableCell>
								<TableCell className='py-1.5 text-[11px]'>
									{product.soldCount}
								</TableCell>
								<TableCell className='py-1.5 pr-3 text-right text-[11px] font-medium whitespace-nowrap'>
									{formatCompactMoney(
										toDisplayAmount(product.totalSoldPrice, currency),
										currency,
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</DashboardWidget>
	)
}

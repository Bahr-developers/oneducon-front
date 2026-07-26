import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { BRANCH_SALES_MOCK } from '../constants/dashboard.mock'
import { useDashboardCurrency } from '../hooks/use-dashboard-currency'
import { formatCompactMoney, formatTrend, toDisplayAmount } from '../lib/format'
import { DashboardWidget } from './dashboard-widget'

export function BranchSalesTable() {
	const { currency } = useDashboardCurrency()

	return (
		<DashboardWidget
			title="Do'konlar bo'yicha savdo"
			action={
				<Link
					to='/dashboard/orders'
					className='inline-flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-[#5C59E8] hover:underline'
				>
					Barchasi
					<ArrowRight className='size-3' />
				</Link>
			}
			contentClassName='overflow-x-auto px-0 pb-2'
		>
			<Table>
				<TableHeader>
					<TableRow className='hover:bg-transparent'>
						<TableHead className='h-8 w-8 pl-3 text-[11px]'>#</TableHead>
						<TableHead className='h-8 text-[11px]'>Do&apos;kon</TableHead>
						<TableHead className='h-8 text-[11px]'>Summa</TableHead>
						<TableHead className='h-8 pr-3 text-right text-[11px]'>
							O&apos;sish
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{BRANCH_SALES_MOCK.map((branch, index) => {
						const positive = branch.growth >= 0
						return (
							<TableRow key={branch.id} className='border-border/60'>
								<TableCell className='py-1.5 pl-3 text-[11px] text-muted-foreground'>
									{index + 1}
								</TableCell>
								<TableCell className='max-w-[100px] truncate py-1.5 text-[11px] font-medium'>
									{branch.name}
								</TableCell>
								<TableCell className='py-1.5 text-[11px] whitespace-nowrap'>
									{formatCompactMoney(
										toDisplayAmount(branch.total, currency),
										currency,
									)}
								</TableCell>
								<TableCell className='py-1.5 pr-3 text-right'>
									<span
										className={cn(
											'inline-flex items-center justify-end gap-0.5 text-[10px] font-semibold',
											positive ? 'text-emerald-500' : 'text-red-500',
										)}
									>
										{positive ? (
											<ArrowUpRight className='size-3' />
										) : (
											<ArrowDownRight className='size-3' />
										)}
										{formatTrend(branch.growth)}
									</span>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</DashboardWidget>
	)
}

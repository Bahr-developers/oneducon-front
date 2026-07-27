import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { formatCompactMoney, formatTrend } from '../lib/format'
import type { DashboardCurrency } from '@/@types/dash-stats'

const TONE_STYLES = {
	purple: 'bg-[#5C59E8]/10 text-[#5C59E8]',
	blue: 'bg-sky-500/10 text-sky-500',
	green: 'bg-emerald-500/10 text-emerald-500',
	red: 'bg-red-500/10 text-red-500',
	orange: 'bg-amber-500/10 text-amber-500',
} as const

export type StatIconTone = keyof typeof TONE_STYLES

interface StatCardProps {
	title: string
	value: number
	currency: DashboardCurrency
	icon: LucideIcon
	tone: StatIconTone
	trendPercent?: number
	trendLabel?: string
	footerLabel?: string
}

export function StatCard({
	title,
	value,
	currency,
	icon: Icon,
	tone,
	trendPercent,
	trendLabel = "O'tgan oyga nisbatan",
	footerLabel,
}: StatCardProps) {
	const isPositive = (trendPercent ?? 0) >= 0

	return (
		<article className='min-w-0 rounded-xl border bg-card p-3 shadow-sm'>
			<div className='flex items-start justify-between gap-2'>
				<p className='truncate text-xs font-medium text-muted-foreground'>
					{title}
				</p>
				<span
					className={cn(
						'inline-flex size-7 shrink-0 items-center justify-center rounded-lg',
						TONE_STYLES[tone],
					)}
				>
					<Icon className='size-3.5' />
				</span>
			</div>

			<p className='mt-2 truncate text-[15px] font-bold tracking-tight text-foreground'>
				{formatCompactMoney(value, currency)}
			</p>

			{typeof trendPercent === 'number' ? (
				<div className='mt-1.5 flex flex-wrap items-center gap-1 text-[10px] leading-tight'>
					<span
						className={cn(
							'inline-flex items-center gap-0.5 font-semibold',
							isPositive ? 'text-emerald-500' : 'text-red-500',
						)}
					>
						{isPositive ? (
							<ArrowUpRight className='size-3' />
						) : (
							<ArrowDownRight className='size-3' />
						)}
						{formatTrend(trendPercent)}
					</span>
					<span className='truncate text-muted-foreground'>{trendLabel}</span>
				</div>
			) : footerLabel ? (
				<p className='mt-1.5 text-[10px] text-muted-foreground'>{footerLabel}</p>
			) : null}
		</article>
	)
}

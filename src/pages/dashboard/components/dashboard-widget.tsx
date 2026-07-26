import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface DashboardWidgetProps {
	title: string
	action?: ReactNode
	children: ReactNode
	className?: string
	contentClassName?: string
}

export function DashboardWidget({
	title,
	action,
	children,
	className,
	contentClassName,
}: DashboardWidgetProps) {
	return (
		<section
			className={cn(
				'flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm',
				className,
			)}
		>
			<header className='flex items-center justify-between gap-2 px-3 pt-3 pb-2'>
				<h3 className='truncate text-[13px] font-semibold text-foreground'>
					{title}
				</h3>
				{action}
			</header>
			<div className={cn('min-w-0 flex-1 px-3 pb-3', contentClassName)}>
				{children}
			</div>
		</section>
	)
}

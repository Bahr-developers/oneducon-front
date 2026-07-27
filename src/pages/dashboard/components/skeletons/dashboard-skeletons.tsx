import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function StatsCardsSkeleton() {
	return (
		<div className='grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5'>
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className='rounded-xl border bg-card p-3 shadow-sm'>
					<div className='flex items-start justify-between'>
						<Skeleton className='h-3 w-16' />
						<Skeleton className='size-7 rounded-lg' />
					</div>
					<Skeleton className='mt-2 h-5 w-24' />
					<Skeleton className='mt-1.5 h-2.5 w-20' />
				</div>
			))}
		</div>
	)
}

export function WidgetSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn('rounded-xl border bg-card p-3 shadow-sm', className)}>
			<Skeleton className='h-4 w-28' />
			<Skeleton className='mt-3 h-32 w-full rounded-lg' />
		</div>
	)
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div className='space-y-2'>
			{Array.from({ length: rows }).map((_, i) => (
				<div key={i} className='flex items-center gap-2'>
					<Skeleton className='size-7 rounded-full' />
					<div className='flex-1 space-y-1.5'>
						<Skeleton className='h-2.5 w-[66%]' />
						<Skeleton className='h-1.5 w-full' />
					</div>
					<Skeleton className='h-3 w-12' />
				</div>
			))}
		</div>
	)
}

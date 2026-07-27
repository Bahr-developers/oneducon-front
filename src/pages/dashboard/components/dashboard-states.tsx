import { cn } from '@/lib/utils'

export function DashboardEmpty({
	message = "Ma'lumot topilmadi",
	className,
}: {
	message?: string
	className?: string
}) {
	return (
		<div
			className={cn(
				'flex min-h-20 items-center justify-center text-xs text-muted-foreground',
				className,
			)}
		>
			{message}
		</div>
	)
}

export function DashboardError({
	message = "Ma'lumotni yuklashda xatolik",
	className,
}: {
	message?: string
	className?: string
}) {
	return (
		<div
			className={cn(
				'flex min-h-20 items-center justify-center text-xs text-destructive',
				className,
			)}
		>
			{message}
		</div>
	)
}

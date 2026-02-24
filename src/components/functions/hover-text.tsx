import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'

type CustomTooltipProps = {
	children: React.ReactNode
	tooltipText: string
	side?: 'top' | 'right' | 'bottom' | 'left'
	align?: 'start' | 'center' | 'end'
}

export function CustomTooltip({
	children,
	tooltipText,
	side = 'right',
	align = 'center',
}: CustomTooltipProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent
				className='bg-[#6A81FF] text-white text-[12px]'
				side={side}
				align={align}
			>
				<p>{tooltipText}</p>
			</TooltipContent>
		</Tooltip>
	)
}

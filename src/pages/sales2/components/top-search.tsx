import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Product } from '@/types/sales-type2'

export default function TopProductSearch({
	value,
	onChange,
	open,
	results,
	onPick,
	onClose,
}: {
	value: string
	onChange: (v: string) => void
	open: boolean
	results: Product[]
	onPick: (p: Product) => void
	onClose: () => void
}) {
	return (
		<div className='p-4 border-b relative'>
			<Input
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder='Artikul, shtrix-kod, mahsulot nomi...'
				className='h-11'
				onBlur={() => {
					setTimeout(onClose, 150)
				}}
			/>

			{open && (
				<Card className='absolute left-4 right-4 top-[72px] z-50 overflow-y-auto'>
					<ScrollArea className='max-h-[420px]'>
						<div className='p-2 space-y-2'>
							{results.length === 0 ? (
								<div className='p-4 text-sm text-muted-foreground'>
									Hech narsa topilmadi
								</div>
							) : (
								results.map(p => (
									<button
										key={p.id}
										type='button'
										onMouseDown={e => e.preventDefault()}
										onClick={() => onPick(p)}
										className='w-full text-left rounded-xl border p-3 hover:bg-muted/40 transition'
									>
										<div className='flex items-start justify-between gap-3'>
											<div className='min-w-0'>
												<div className='font-medium truncate'>{p.name}</div>
											</div>

											<div className='text-right'>
												<div className='font-semibold'>{p.usd_rate} UZS</div>
												<div className='text-xs text-muted-foreground'>
													Kol-vo: {p.quantity ?? '-'} шт
												</div>
											</div>
										</div>
									</button>
								))
							)}
						</div>
					</ScrollArea>
				</Card>
			)}
		</div>
	)
}

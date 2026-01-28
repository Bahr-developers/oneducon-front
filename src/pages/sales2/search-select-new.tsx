import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { product } from '@/types'
import { productUtils } from '@/utils/products'
import { useQuery } from '@tanstack/react-query'

interface SearchSelectProps {
	value: string
	onChange: (value: string) => void
	open: boolean
	onClose: () => void
	onSelect: (product: product) => void
}

export default function SearchSelect({
	value,
	onChange,
	open,
	onClose,
	onSelect,
}: SearchSelectProps) {
	const { data: filtered, isLoading } = useQuery({
		queryKey: ['get_all_products', value],
		queryFn: () => productUtils.getProducts({ search: value }),
		enabled: value.length > 0,
	})

	const results = filtered?.data || []

	const handleSelect = (product: product) => {
		onSelect(product)
		onChange('')
		onClose()
	}

	return (
		<div className='relative w-full'>
			<Input
				type='text'
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder='Artikul, shtrix-kod, mahsulot nomi...'
				className='w-full bg-[#0a0a0a] border-[#333] text-white h-12 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#666]'
				onBlur={() => setTimeout(onClose, 200)}
			/>

			{open && value && (
				<Card className='absolute z-50 w-full mt-2 overflow-hidden bg-[#1a1a1a] border-[#333]'>
					<ScrollArea className='max-h-[420px]'>
						<div className='p-2 space-y-2'>
							{isLoading ? (
								<div className='p-4 text-sm text-[#888] text-center'>
									Yuklanmoqda...
								</div>
							) : results.length === 0 ? (
								<div className='p-4 text-sm text-[#888] text-center'>
									Hech narsa topilmadi
								</div>
							) : (
								results.map((p: product) => {
									const isDisabled = p.quantity === 0
									return (
										<button
											key={p.id}
											type='button'
											onMouseDown={e => e.preventDefault()}
											onClick={() => !isDisabled && handleSelect(p)}
											disabled={isDisabled}
											className={`w-full text-left rounded-xl border border-[#2a2a2a] p-3 transition ${
												isDisabled
													? 'bg-[#0f0f0f] cursor-not-allowed opacity-50'
													: 'hover:bg-[#2a2a2a]'
											}`}
										>
											<div className='flex items-start justify-between gap-3'>
												<div className='min-w-0'>
													<div className='font-medium truncate text-white'>
														{p.name}
													</div>
													<div className='text-xs text-[#888] mt-1'>
														ID: {p.id}
													</div>
												</div>

												<div className='text-right'>
													<div className='font-semibold text-white'>
														{p.sale_price?.toLocaleString()} UZS
													</div>
													<div className='text-xs text-[#888]'>
														Mavjud: {p.quantity ?? '-'} dona
														{isDisabled && ' (tugagan)'}
													</div>
												</div>
											</div>
										</button>
									)
								})
							)}
						</div>
					</ScrollArea>
				</Card>
			)}
		</div>
	)
}

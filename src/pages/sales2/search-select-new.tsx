import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { product } from '@/types'
import { productUtils } from '@/utils/products'
import { useQuery } from '@tanstack/react-query'
import { useRef, useEffect } from 'react'

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
	const containerRef = useRef<HTMLDivElement>(null)
	const isSelectingRef = useRef(false)

	const { data: filtered, isLoading } = useQuery({
		queryKey: ['get_all_products', value],
		queryFn: () => productUtils.getProducts({ search: value }),
		enabled: value.length > 0,
	})

	const results = filtered?.data || []

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				if (!isSelectingRef.current) {
					onClose()
				}
			}
		}

		if (open) {
			document.addEventListener('mousedown', handleClickOutside)
			return () => {
				document.removeEventListener('mousedown', handleClickOutside)
			}
		}
	}, [open, onClose])

	const handleSelect = (product: product) => {
		isSelectingRef.current = true
		onSelect(product)
		onChange('')
		onClose()

		// Reset flag
		setTimeout(() => {
			isSelectingRef.current = false
		}, 100)
	}

	return (
		<div ref={containerRef} className='relative w-full'>
			<Input
				type='text'
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder='Artikul, shtrix-kod, mahsulot nomi...'
				className='w-full bg-[#0a0a0a] border-[#333] text-white h-12 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#666]'
				autoComplete='off'
			/>

			{open && value && (
				<div className='absolute z-50 w-full mt-2 overflow-hidden bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl'>
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
											onClick={() => !isDisabled && handleSelect(p)}
											disabled={isDisabled}
											className={`w-full text-left rounded-xl border border-[#2a2a2a] p-3 transition ${
												isDisabled
													? 'bg-[#0f0f0f] cursor-not-allowed opacity-50'
													: 'hover:bg-[#2a2a2a] active:bg-[#333]'
											}`}
										>
											<div className='flex items-start justify-between gap-3'>
												<div className='min-w-0 flex-1'>
													<h2 className='font-medium truncate text-white'>
														{p.name}
													</h2>
													<span className='text-xs text-[#888] mt-1'>
														ID: {p.id}
													</span>
												</div>

												<div className='text-right whitespace-nowrap'>
													<p className='font-semibold text-white'>
														{p.sale_price?.toLocaleString()} UZS
													</p>
													<span className='text-xs text-[#888]'>
														Mavjud: {p.quantity ?? '-'} dona
														{isDisabled && ' (tugagan)'}
													</span>
												</div>
											</div>
										</button>
									)
								})
							)}
						</div>
					</ScrollArea>
				</div>
			)}
		</div>
	)
}

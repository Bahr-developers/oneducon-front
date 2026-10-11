import type { product } from '@/@types'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { formatPrice } from '@/lib/utils'
import { productUtils } from '@/utils/products'
import { useQuery } from '@tanstack/react-query'
import { Check, LoaderCircle, PackageSearch, Search, Warehouse } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ProductSearchProps {
	disabledProductIds: number[]
	onSelect: (item: product) => void
}

export function ProductSearch({ disabledProductIds, onSelect }: ProductSearchProps) {
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)
	const debouncedQuery = useDebounce(query.trim(), 350)

	const { data, isLoading, isError } = useQuery({
		queryKey: ['import-product-search', debouncedQuery],
		queryFn: () =>
			productUtils.getProducts({
				search: debouncedQuery || undefined,
				page: 1,
				limit: 12,
			}),
		enabled: isOpen,
		staleTime: 30_000,
	})

	useEffect(() => {
		const closeOnOutsideClick = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
		}
		document.addEventListener('mousedown', closeOnOutsideClick)
		return () => document.removeEventListener('mousedown', closeOnOutsideClick)
	}, [])

	const products: product[] = data?.data ?? []

	return (
		<div ref={rootRef} className='relative'>
		<div className='relative'>
			<Search className='pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6A81FF]' />
			<Input
				value={query}
				onChange={event => {
					setQuery(event.target.value)
					setIsOpen(true)
				}}
				onFocus={() => setIsOpen(true)}
				onKeyDown={event => event.key === 'Escape' && setIsOpen(false)}
				placeholder='Nomi yoki shtrix-kodi bo‘yicha qidiring'
				aria-label='Mahsulot qidirish'
				aria-expanded={isOpen}
				className='h-14 rounded-xl border-[#DCE2FF] bg-white pl-12 pr-4 text-[15px] shadow-[0_8px_28px_rgba(75,94,180,0.08)] focus-visible:border-[#6A81FF] focus-visible:ring-[#6A81FF]/20 dark:bg-background'
			/>
		</div>

		{isOpen && (
			<div className='absolute z-50 mt-2 max-h-[420px] w-full overflow-y-auto rounded-xl border border-[#DCE2FF] bg-background p-2 shadow-[0_20px_60px_rgba(31,42,99,0.18)]'>
				{isLoading ? (
					<div className='flex h-24 items-center justify-center gap-2 text-sm text-muted-foreground'>
						<LoaderCircle className='size-5 animate-spin' /> Mahsulotlar yuklanmoqda
					</div>
				) : isError ? (
					<div className='p-5 text-center text-sm text-red-500'>
						Mahsulotlarni yuklab bo‘lmadi. Qayta urinib ko‘ring.
					</div>
				) : products.length === 0 ? (
					<div className='flex flex-col items-center gap-2 p-7 text-center text-sm text-muted-foreground'>
						<PackageSearch className='size-7' />
						Mos mahsulot topilmadi
					</div>
				) : (
					<ul role='listbox' className='space-y-1'>
						{products.map(item => {
							const selected = disabledProductIds.includes(Number(item.id))
							return (
								<li key={item.id}>
									<button
										type='button'
										disabled={selected}
										onClick={() => {
											onSelect(item)
											setQuery('')
											setIsOpen(false)
										}}
										className='group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[#F2F4FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A81FF] disabled:cursor-not-allowed disabled:opacity-55 dark:hover:bg-[#6A81FF]/10'
									>
										<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF1FF] text-[#536BE8] dark:bg-[#6A81FF]/15'>
											{selected ? <Check className='size-5' /> : <Warehouse className='size-5' />}
										</div>
										<div className='min-w-0 flex-1'>
											<div className='flex items-center gap-2'>
												<span className='truncate font-medium'>{item.name}</span>
												{selected && <span className='text-xs text-[#536BE8]'>Tanlangan</span>}
											</div>
											<p className='mt-0.5 truncate text-xs text-muted-foreground'>
												{item.barcode || 'Shtrix-kod yo‘q'} · Omborda {item.quantity} {item.unit?.name || 'dona'}
											</p>
										</div>
										<div className='shrink-0 text-right'>
											<p className='text-sm font-medium'>{formatPrice(item.sale_price || 0)}</p>
											<p className='text-xs text-muted-foreground'>sotuv narxi</p>
										</div>
									</button>
								</li>
							)
						})}
					</ul>
				)}
			</div>
		)}
		</div>
	)
}

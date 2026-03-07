import { Input } from '@/components/ui/input'
import { product } from '@/@types'
import { productUtils } from '@/utils/products'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface SearchSelectProps {
	onSelect: (product: product) => void
	selectedProduct?: product | null
	disabledProductIds?: number[]
	isActive: boolean // ulgirji va tan narx
}

export default function SearchSelect({
	onSelect,
	disabledProductIds = [],
	isActive,
}: SearchSelectProps) {
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)

	const { data: filtered, isLoading } = useQuery({
		queryKey: ['get_all_products', query],
		queryFn: () => productUtils.getProducts({ search: query }),
		enabled: query.length > 0,
	})

	const handleSelect = (product: product) => {
		onSelect(product)
		setQuery(product.name)
		setIsOpen(false)
	}

	const highlightText = (text: string, highlight: string) => {
		if (!highlight.trim()) {
			return <mark>{text}</mark>
		}
		const words = highlight
			.trim()
			.split(/\s+/)
			.filter(word => word.length > 0)

		const escapedWords = words.map(word =>
			word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
		)
		const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi')
		const parts = text.split(regex)

		return (
			<span>
				{parts.map((part, index) =>
					// Agar qism qidirilayotgan so'zlardan biriga mos kelsa (registrga qaramasdan)
					words.some(word => word.toLowerCase() === part.toLowerCase()) ? (
						<mark
							key={index}
							className='bg-[#6a80ffad] rounded-sm pl-0.5 text-white font-medium'
						>
							{part}
						</mark>
					) : (
						<span key={index}>{part}</span>
					),
				)}
			</span>
		)
	}

	const isProductDisabled = (product: product) => {
		if (disabledProductIds.includes(Number(product.id))) {
			return true
		}
		if (product.quantity === 0) {
			return true
		}
		return false
	}

	const getDisabledReason = (product: product) => {
		if (disabledProductIds.includes(Number(product.id))) {
			return '(tanlangan)'
		}
		if (product.quantity === 0) {
			return '(mahsulot tugagan)'
		}
		return ''
	}

	return (
		<div className='relative w-full'>
			<Input
				type='text'
				value={query}
				onChange={e => {
					setQuery(e.target.value)
					setIsOpen(true)
				}}
				onFocus={() => setIsOpen(true)}
				placeholder='Mahsulot nomi...'
				className='w-full border h-12 rounded-lg px-3 text-[15px] font-medium py-2 outline-none focus:ring-2 focus:ring-blue-500'
			/>

			{isOpen && query && (
				<ul className='absolute z-10 w-full bg-[#f3f3f3] border border-gray-200 dark:bg-background transition-colors rounded-2xl mt-1.5 max-h-[550px] overflow-y-auto shadow-lg p-2 space-y-2'>
					{isLoading ? (
						<li className='px-3 py-3 text-gray-500 text-center bg-white rounded-xl shadow-sm'>
							Yuklanmoqda...
						</li>
					) : filtered?.data?.length > 0 ? (
						filtered?.data?.map((product: product) => {
							const disabled = isProductDisabled(product)
							const disabledReason = getDisabledReason(product)

							return (
								<li
									key={product.id}
									onClick={() => !disabled && handleSelect(product)}
									className={`rounded-2xl bg-white shadow-sm border border-gray-100 px-4 py-3 transition-all flex justify-between items-center gap-3 ${
										disabled
											? 'opacity-60 cursor-not-allowed'
											: 'cursor-pointer hover:shadow-md hover:border-gray-200 hover:bg-gray-50'
									}`}
								>
									<div className='flex-1 min-w-0'>
										<span
											className={`block font-semibold text-[18px]  truncate ${isActive ? 'text-blue-400' : ''}`}
										>
											{highlightText(product.name, query)}
										</span>

										{disabledReason && (
											<span className='text-red-400 text-sm mt-1 inline-block'>
												{disabledReason}
											</span>
										)}
									</div>

									<div className='shrink-0 text-right'>
										{isActive ? (
											<div className='flex flex-col gap-2 text-lg font-bold text-gray-700'>
												<span>
													Sotuv narxi: {product.sale_price?.toLocaleString()}{' '}
													so'm
												</span>
												<span>
													Tan narxi: {product.cost_price?.toLocaleString()} so'm
												</span>
											</div>
										) : (
											<span className='block text-lg font-bold text-gray-700'>
												Sotuv narxi: {product.sale_price?.toLocaleString()} so'm
											</span>
										)}
									</div>
								</li>
							)
						})
					) : (
						<li className='px-3 py-3 text-gray-500 text-center bg-white rounded-xl shadow-sm'>
							Hech narsa topilmadi
						</li>
					)}
				</ul>
			)}
		</div>
	)
}

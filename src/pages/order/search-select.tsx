import { Input } from '@/components/ui/input'
import { product } from '@/types'
import { productUtils } from '@/utils/products'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface SearchSelectProps {
	onSelect: (product: product) => void
	selectedProduct?: product | null
	disabledProductIds?: number[]
}

export default function SearchSelect({
	onSelect,
	disabledProductIds = [],
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
				placeholder='Mahsulot nomi...'
				className='w-full border h-12 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
			/>

			{isOpen && query && (
				<ul className='absolute z-10 w-full bg-white border dark:text-black transition-colors rounded-lg mt-1 max-h-40 overflow-y-auto'>
					{isLoading ? (
						<li className='px-3 py-2 text-gray-500 text-center'>
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
									className={`px-3 py-2 cursor-pointer transition-colors flex justify-between ${
										disabled
											? 'bg-gray-200 text-gray-400 cursor-not-allowed'
											: 'hover:bg-[#e2e0e0c0]'
									}`}
								>
									<span>{product.name}</span>
									<span className='text-gray-500 text-sm'>
										{product.sale_price?.toLocaleString()} so'm
										{disabledReason && ` ${disabledReason}`}
									</span>
								</li>
							)
						})
					) : (
						<li className='px-3 py-2 text-gray-500'>Hech narsa topilmadi</li>
					)}
				</ul>
			)}
		</div>
	)
}

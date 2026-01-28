/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

interface UniversalSearchSelectProps<T> {
	data: T[]
	searchKey: keyof T | (keyof T)[] // Bitta yoki bir nechta key
	displayKey: keyof T
	secondaryKey?: keyof T
	value?: T | null

	onSelect: (item: T) => void

	// Placeholder
	placeholder?: string

	renderItem?: (item: T) => React.ReactNode

	disabled?: boolean

	error?: string

	isLoading?: boolean
	className?: string
}

function UniversalSearchSelect<T extends Record<string, any>>({
	data,
	searchKey,
	displayKey,
	secondaryKey,
	value,
	onSelect,
	placeholder = 'Qidirish...',
	renderItem,
	disabled = false,
	error,
	isLoading = false,
	className,
}: UniversalSearchSelectProps<T>) {
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [highlightedIndex, setHighlightedIndex] = useState(0)
	const wrapperRef = useRef<HTMLDivElement>(null)

	// Tanlangan elementni input'ga ko'rsatish
	useEffect(() => {
		if (value) {
			setQuery(String(value[displayKey]))
		}
	}, [value, displayKey])

	// Tashqarida bosganida yopish
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Filtrlangan natijalar - bir nechta key bo'yicha qidirish
	const filteredData = data?.filter(item => {
		const searchQuery = query.toLowerCase()

		// Agar searchKey array bo'lsa
		if (Array.isArray(searchKey)) {
			return searchKey.some(key => {
				const searchValue = String(item[key]).toLowerCase()
				return searchValue.includes(searchQuery)
			})
		}

		// Agar searchKey bitta key bo'lsa
		const searchValue = String(item[searchKey]).toLowerCase()
		return searchValue.includes(searchQuery)
	})

	// Element tanlash
	const handleSelect = (item: T) => {
		onSelect(item)
		setQuery(String(item[displayKey]))
		setIsOpen(false)
		setHighlightedIndex(0)
	}

	// Tozalash
	const handleClear = () => {
		setQuery('')
		onSelect(null as any)
		setIsOpen(false)
	}

	// Input o'zgarishi
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value)
		setIsOpen(true)
		setHighlightedIndex(0)
	}

	// Klaviatura navigatsiyasi
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen) return

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				setHighlightedIndex(prev =>
					prev < filteredData.length - 1 ? prev + 1 : prev,
				)
				break
			case 'ArrowUp':
				e.preventDefault()
				setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0))
				break
			case 'Enter':
				e.preventDefault()
				if (filteredData[highlightedIndex]) {
					handleSelect(filteredData[highlightedIndex])
				}
				break
			case 'Escape':
				setIsOpen(false)
				break
		}
	}

	return (
		<div ref={wrapperRef} className={`relative w-full ${className}`}>
			<div className='relative'>
				<Input
					type='text'
					value={query}
					onChange={handleInputChange}
					onFocus={() => setIsOpen(true)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled || isLoading}
					className={
						`w-full h-12 pr-10 ${error ? 'border-red-500' : ''}` + className
					}
				/>
				{query && !disabled && (
					<button
						onClick={handleClear}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
					>
						<X size={18} />
					</button>
				)}
			</div>

			{error && <p className='text-sm text-red-500 mt-1'>{error}</p>}

			{isOpen && query && (
				<ul className='absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg'>
					{isLoading ? (
						<li className='px-4 py-3 text-center text-gray-500'>
							Yuklanmoqda...
						</li>
					) : filteredData.length > 0 ? (
						filteredData.map((item, index) => (
							<li
								key={index}
								onClick={() => handleSelect(item)}
								className={`px-4 py-3 cursor-pointer transition-colors ${
									index === highlightedIndex
										? 'bg-blue-100 dark:bg-blue-900'
										: 'hover:bg-gray-100 dark:hover:bg-gray-700'
								}`}
							>
								{renderItem ? (
									renderItem(item)
								) : (
									<div className='flex justify-between items-center'>
										<span className='font-medium'>
											{String(item[displayKey])}
										</span>
										{secondaryKey && (
											<span className='text-sm text-gray-500'>
												{String(item[secondaryKey])}
											</span>
										)}
									</div>
								)}
							</li>
						))
					) : (
						<li className='px-4 py-3 text-center text-gray-500'>
							Hech narsa topilmadi
						</li>
					)}
				</ul>
			)}
		</div>
	)
}

export default UniversalSearchSelect

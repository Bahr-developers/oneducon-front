import React, { useState, useEffect, forwardRef } from 'react'
import { Input } from '../ui/input'

interface NumberInputProps {
	value?: number
	onChange?: (data: { formatted: string; raw: number }) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
	placeholder?: string
	className?: string
	readonly?: boolean
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
	(
		{
			value,
			onChange,
			placeholder = 'Raqam kiriting',
			className = '',
			readonly = false,
			onKeyDown,
			onFocus,
		},
		ref,
	) => {
		const [inputValue, setInputValue] = useState('')

		// Formatlash funksiyasi: Butun qismni probel bilan, kasrni o'z holicha qaytaradi
		const formatNumber = (numStr: string) => {
			if (!numStr) return ''

			// Nuqta bo'yicha ikkiga bo'lamiz
			const parts = numStr.split('.')
			const integerPart = parts[0]
			const decimalPart = parts[1]

			// Butun qismiga probel qo'shamiz
			const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

			// Agar kasr qismi bo'lsa, ularni birlashtiramiz
			if (parts.length > 1) {
				return `${formattedInteger}.${decimalPart}`
			}

			return formattedInteger
		}

		useEffect(() => {
			if (value !== undefined && value !== null && !isNaN(value)) {
				// Agar 0 kelsa va user yozayotgan bo'lsa muammo bo'lmasligi uchun tekshiramiz
				// Lekin backenddan 0 kelsa ko'rsatish kerak, shuning uchun 0 ni ham inobatga olamiz
				if (value === 0) {
					setInputValue('') // Yoki '0' xohishingizga qarab
				} else {
					setInputValue(formatNumber(value.toString()))
				}
			} else {
				setInputValue('')
			}
		}, [value])

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			// 1. Faqat raqam va bitta nuqtani qoldiramiz
			let raw = e.target.value.replace(/[^0-9.]/g, '')

			// 2. Agar bir nechta nuqta bo'lsa, faqat birinchisini qoldiramiz
			const dots = raw.match(/\./g)
			if (dots && dots.length > 1) {
				return // Ikkinchi nuqta yozilganda o'zgartirmaymiz
			}

			// 3. Kasr qismi 2 xonadan oshmasligini tekshiramiz
			const parts = raw.split('.')
			if (parts[1] && parts[1].length > 2) {
				return // 2 xonadan oshsa yozdirmaymiz
			}

			// 4. Ekranga chiqarish uchun formatlaymiz
			const formatted = formatNumber(raw)
			setInputValue(formatted)

			if (onChange) {
				onChange({
					formatted,
					// Agar oxiri nuqta bilan tugagan bo'lsa ham raw formatda raqam qilib beramiz
					raw: raw === '' ? 0 : Number(raw),
				})
			}
		}

		return (
			<Input
				ref={ref}
				type='text'
				inputMode='decimal' // Mobil telefonda nuqtali klaviatura chiqishi uchun
				value={inputValue}
				readOnly={readonly}
				onChange={handleChange}
				onKeyDown={onKeyDown}
				onFocus={onFocus}
				placeholder={placeholder}
				autoComplete='off'
				className={`border rounded-lg px-3 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring transition-all ${className}`}
			/>
		)
	},
)

NumberInput.displayName = 'NumberInput'
export default NumberInput

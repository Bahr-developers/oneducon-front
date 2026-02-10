import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'

interface PhoneInputProps {
	value?: string // tashqaridan keladigan qiymat (formatted yoki raw)
	onChange?: (data: {
		formatted: string // +998 97 108 20 04
		raw: string // 998971082004
		isValid: boolean // true/false
	}) => void
	className?: string
}

// Telefon raqamni formatlash
function formatUzPhone(value: string): string {
	const digits = value.replace(/\D/g, '') // faqat raqamlar
	let d = digits

	if (!d.startsWith('998')) {
		if (d.startsWith('9')) d = '998' + d
		else d = '998' + d
	}

	d = d.slice(0, 12)

	const country = '+998'
	const op = d.slice(3, 5)
	const p1 = d.slice(5, 8)
	const p2 = d.slice(8, 10)
	const p3 = d.slice(10, 12)

	let out = country
	if (op) out += ' ' + op
	if (p1) out += ' ' + p1
	if (p2) out += ' ' + p2
	if (p3) out += ' ' + p3

	return out
}

// Validatsiya
function isValidUzPhone(phone: string): boolean {
	const re = /^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/
	return re.test(phone)
}

// Faqat raqamlarni olish
function getRawUzPhone(phone: string): string {
	return phone.replace(/\D/g, '')
}

const PhoneInput: React.FC<PhoneInputProps> = ({
	value,
	onChange,
	className,
}) => {
	const [internalValue, setInternalValue] = useState('+998 ')
	const [isValid, setIsValid] = useState(true)

	// 🧩 Agar tashqaridan value kelsa (edit holati) — initial holatda o‘rnatamiz
	useEffect(() => {
		if (value) {
			const formatted = formatUzPhone(value)
			const valid = isValidUzPhone(formatted)
			setInternalValue(formatted)
			setIsValid(valid)
		}
	}, [value])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatUzPhone(e.target.value)
		const valid = isValidUzPhone(formatted)
		const raw = getRawUzPhone(formatted)

		setInternalValue(formatted)
		setIsValid(valid)

		onChange?.({ formatted, raw, isValid: valid })
	}

	return (
		<Input
			type='tel'
			value={internalValue}
			onChange={handleChange}
			className={`border outline-none transition duration-200 
        ${
					isValid
						? 'border-gray-300 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
						: 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]'
				}
        ${className || ''}
      `}
			maxLength={20}
			placeholder='+998 97 108 20 04'
		/>
	)
}

export default PhoneInput

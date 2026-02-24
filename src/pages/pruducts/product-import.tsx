'use client'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
	onUpload: (file: File) => void
	loading?: boolean
}

export function ProductImportButton({ loading }: Props) {
	const fileRef = useRef<HTMLInputElement | null>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) {
			return
		}

		const allowedTypes = [
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel',
		]

		if (!allowedTypes.includes(file.type)) {
			alert('Faqat Excel fayl yuklash mumkin (.xlsx yoki .xls)')
			if (fileRef.current) {
				fileRef.current.value = ''
			}
			return
		}

		// Input ni tozalash
		setTimeout(() => {
			if (fileRef.current) {
				fileRef.current.value = ''
			}
		}, 100)
	}

	const handleClick = () => {
		fileRef.current?.click()
	}

	return (
		<>
			<input
				type='file'
				ref={fileRef}
				className='hidden'
				accept='.xlsx,.xls'
				onChange={handleFileChange}
				// Key prop qo'shish - komponentni qayta render qilish uchun
				key={Date.now()}
			/>
			<Button
				variant='default'
				disabled={loading}
				onClick={handleClick}
				className='h-10 bg-green-500 hover:bg-green-700 cursor-pointer'
			>
				{loading ? 'Yuklanmoqda...' : 'Excel Import'}
			</Button>
		</>
	)
}

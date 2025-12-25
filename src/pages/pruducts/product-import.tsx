'use client'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
	onUpload: (file: File) => void
	loading?: boolean
}

export function ProductImportButton({ onUpload, loading }: Props) {
	const fileRef = useRef<HTMLInputElement | null>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log('File selected') // Debug uchun

		const file = e.target.files?.[0]
		if (!file) {
			console.log('No file selected')
			return
		}

		console.log('File:', file.name, file.type) // Debug uchun

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

		console.log('Calling onUpload') // Debug uchun
		onUpload(file)

		// Input ni tozalash
		setTimeout(() => {
			if (fileRef.current) {
				fileRef.current.value = ''
			}
		}, 100)
	}

	const handleClick = () => {
		console.log('Button clicked') // Debug uchun
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

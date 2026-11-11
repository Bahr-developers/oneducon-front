import { WandSparkles } from 'lucide-react'
import { useId, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ProductBarcodeFieldProps {
	value: string
	onChange: (value: string) => void
	generateWhenEmpty?: boolean
	inputRef?: (input: HTMLInputElement | null) => void
}

export function ProductBarcodeField({
	value,
	onChange,
	generateWhenEmpty = false,
	inputRef,
}: ProductBarcodeFieldProps) {
	const id = useId()
	const field = useRef<HTMLInputElement>(null)
	const showGenerator = !generateWhenEmpty || !value.trim()

	const handleGenerate = () => {
		const randomValues = crypto.getRandomValues(new Uint32Array(12))
		const barcode = Array.from(randomValues, number => number % 10).join('')
		onChange(barcode)
		field.current?.focus()
	}

	return (
		<div className='w-full space-y-2'>
			<Label htmlFor={id}>Barcode</Label>
			<div className='relative'>
				<Input
					id={id}
					ref={input => {
						field.current = input
						inputRef?.(input)
					}}
					type='text'
					autoComplete='off'
					className={cn('h-12', showGenerator && 'pr-12')}
					placeholder='4780087820048'
					value={value}
					onChange={event => onChange(event.target.value)}
				/>
				{showGenerator && (
					<Button
						type='button'
						variant='ghost'
						size='icon'
						className='absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground'
						aria-label='12 raqamli barcode yaratish'
						title='12 raqamli barcode yaratish'
						onClick={handleGenerate}
					>
						<WandSparkles aria-hidden='true' />
					</Button>
				)}
			</div>
		</div>
	)
}

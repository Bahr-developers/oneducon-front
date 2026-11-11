import { useId, useMemo, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { Barcode as BarcodeIcon, Printer, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { SelectedProduct } from '@/store/product-selection-slice'
import {
	barcodeWidth,
	codeTextSize,
	encodeBarcode,
	labelNameLines,
	LABEL_GAP_MM,
	LABEL_PADDING_MM,
	minLabelWidth,
	type Barcode,
	type LabelSize,
} from './barcode-label'
import labelStyles from './barcode-label.css?inline'

const presets = [
	{ width: '30', height: '20' },
	{ width: '40', height: '30' },
	{ width: '50', height: '30' },
	{ width: '60', height: '40' },
]

const sizeFields = [
	{ key: 'width', label: 'Eni (mm)', min: 20, max: 64 },
	{ key: 'height', label: 'Bo‘yi (mm)', min: 16, max: 100 },
	{ key: 'fontSize', label: 'Matn kattaligi (pt)', min: 6, max: 18 },
] as const

interface PrintableLabel {
	id: string
	name: string
	barcode: Barcode
}

function BarcodeLabel({ label, size }: { label: PrintableLabel; size: LabelSize }) {
	const { barcode, name } = label
	const style = {
		'--label-width': `${size.width}mm`,
		'--label-height': `${size.height}mm`,
		'--label-padding': `${LABEL_PADDING_MM}mm`,
		'--label-gap': `${LABEL_GAP_MM}mm`,
		'--label-font-size': `${size.fontSize}pt`,
		'--label-name-lines': labelNameLines(size),
	} as CSSProperties

	return (
		<div className='barcode-label' style={style}>
			<p className='barcode-label__name' title={name}>{name}</p>
			<svg
				className='barcode-label__symbol'
				aria-hidden='true'
				style={{ width: `${barcodeWidth(barcode, size.width)}mm` }}
				viewBox={`0 0 ${barcode.modules} 1`}
				preserveAspectRatio='none'
				shapeRendering='crispEdges'
			>
				<path d={barcode.path} fill='currentColor' />
			</svg>
			<p className='barcode-label__value' style={{ fontSize: `${codeTextSize(barcode, size)}pt` }}>
				{barcode.value}
			</p>
		</div>
	)
}

function printLabels(labels: PrintableLabel[], size: LabelSize) {
	const popup = window.open('', '_blank', 'popup,width=460,height=680')
	if (!popup) {
		toast.error('Chop etish uchun brauzerda qalqib chiquvchi oynaga ruxsat bering')
		return
	}

	const doc = popup.document
	doc.documentElement.lang = 'uz'
	doc.title = 'Mahsulot shtrix-kodlari'
	doc.body.className = 'barcode-print-document'

	const style = doc.createElement('style')
	style.textContent = `@page { size: ${size.width}mm ${size.height}mm; margin: 0; }\n${labelStyles}`
	doc.head.append(style)

	const root = createRoot(doc.body)
	flushSync(() => {
		root.render(labels.map(label => <BarcodeLabel key={label.id} label={label} size={size} />))
	})
	popup.addEventListener('afterprint', () => {
		root.unmount()
		popup.close()
	}, { once: true })
	popup.focus()
	popup.print()
}

export default function BarcodePrintDialog({
	products,
	disabled,
	onRemove,
}: {
	products: SelectedProduct[]
	disabled: boolean
	onRemove: (id: string) => void
}) {
	const [draft, setDraft] = useState({ ...presets[1], fontSize: '9' })
	const [activeId, setActiveId] = useState<string>()
	const formId = useId()
	const size = { width: Number(draft.width), height: Number(draft.height), fontSize: Number(draft.fontSize) }
	const invalidSize = sizeFields.some(({ key, min, max }) => !(size[key] >= min && size[key] <= max))
	const sizeError = invalidSize
		? 'Eni 20–64 mm, bo‘yi 16–100 mm va matn 6–18 pt oralig‘ida bo‘lsin.'
		: labelNameLines(size) < 1
			? 'Nom uchun joy yetarli emas. Bo‘yini oshiring yoki matnni kichraytiring.'
			: null

	const encoded = useMemo(() => products.map(product => ({
		...product,
		symbol: encodeBarcode(product.barcode),
	})), [products])

	const rows = encoded.map(({ id, name, barcode, symbol }) => {
		if (!symbol) {
			return { id, name, label: null, issue: barcode?.trim() ? 'Shtrix-kod formati mos emas' : 'Shtrix-kod yo‘q' }
		}
		if (!invalidSize && size.width < minLabelWidth(symbol)) {
			return { id, name, label: null, issue: `Eni kamida ${Math.ceil(minLabelWidth(symbol))} mm bo‘lishi kerak` }
		}
		return { id, name, label: { id, name, barcode: symbol }, issue: null }
	})
	const printable = rows.flatMap(row => row.label ? [row.label] : [])
	const active = rows.find(row => row.id === activeId) ?? rows.find(row => row.label) ?? rows[0]
	const excluded = rows.length - printable.length

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm' disabled={disabled}>
					<Printer aria-hidden='true' /> Barcode print
				</Button>
			</DialogTrigger>
			<DialogContent className='flex max-h-[90dvh] min-w-0 flex-col gap-0 overflow-hidden p-0 motion-reduce:animate-none sm:max-w-3xl'>
				<DialogHeader className='shrink-0 border-b px-5 py-4 pr-12 text-left sm:px-6'>
					<DialogTitle>Barcode print</DialogTitle>
					<DialogDescription>Har bir tanlangan mahsulot uchun alohida yorliq.</DialogDescription>
				</DialogHeader>

				<div className='grid min-h-0 min-w-0 gap-5 overflow-y-auto p-5 sm:grid-cols-2 sm:p-6'>
					<section className='min-w-0 space-y-4' aria-labelledby={`${formId}-size`}>
						<div className='space-y-2'>
							<h3 id={`${formId}-size`} className='text-sm font-semibold'>Yorliq o‘lchami</h3>
							<div className='flex flex-wrap gap-1.5'>
								{presets.map(preset => {
									const selected = size.width === Number(preset.width) && size.height === Number(preset.height)
									return (
										<Button
											key={preset.width}
											variant={selected ? 'secondary' : 'outline'}
											size='sm'
											aria-pressed={selected}
											aria-label={`${preset.width} × ${preset.height} mm`}
											onClick={() => setDraft(current => ({ ...current, ...preset }))}
										>
											{preset.width} × {preset.height}
										</Button>
									)
								})}
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							{sizeFields.map(({ key, label, min, max }) => (
								<div key={key} className={cn('min-w-0 space-y-1.5', key === 'fontSize' && 'col-span-2')}>
									<Label htmlFor={`${formId}-${key}`}>{label}</Label>
									<Input
										id={`${formId}-${key}`}
										type='number'
										inputMode='decimal'
										min={min}
										max={max}
										step='any'
										value={draft[key]}
										onChange={event => setDraft(current => ({ ...current, [key]: event.target.value }))}
									/>
								</div>
							))}
						</div>
						{sizeError && <p role='status' className='text-sm text-destructive'>{sizeError}</p>}
						<p className='text-xs leading-relaxed text-muted-foreground'>
							Printer oynasida bir xil qog‘oz o‘lchami, 100% masshtab va chetlarsiz chop etishni tanlang.
						</p>
					</section>

					<section className='min-w-0 space-y-3' aria-labelledby={`${formId}-preview`}>
						<h3 id={`${formId}-preview`} className='text-sm font-semibold'>Yorliq ko‘rinishi</h3>
						<div className='overflow-auto rounded-lg border bg-muted/50 p-2'>
							<style>{labelStyles}</style>
							<div className='flex min-h-28 w-max min-w-full items-center justify-center'>
								{active?.label && !sizeError ? (
									<div className='m-1 shadow-sm ring-1 ring-black/15'>
										<BarcodeLabel label={active.label} size={size} />
									</div>
								) : (
									<p className='max-w-52 p-3 text-center text-xs text-muted-foreground'>
										{active?.issue ?? (active ? 'Yorliq o‘lchamini tekshiring' : 'Mahsulot tanlanmagan')}
									</p>
								)}
							</div>
						</div>

						{rows.length > 0 && (
							<ul aria-label='Tanlangan mahsulotlar' className='max-h-36 divide-y overflow-y-auto rounded-lg border'>
								{rows.map(row => (
									<li key={row.id} className={cn('flex items-center gap-1 p-1', active?.id === row.id && 'bg-accent')}>
										<button
											type='button'
											aria-pressed={active?.id === row.id}
											onClick={() => setActiveId(row.id)}
											className='flex min-w-0 flex-1 items-start gap-2 rounded-md p-2 text-left text-xs outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring'
										>
											<BarcodeIcon className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
											<span className='min-w-0'>
												<span className='block truncate font-medium' title={row.name}>{row.name}</span>
												{row.issue && <span className='block text-destructive'>{row.issue}</span>}
											</span>
										</button>
										<Button
											variant='ghost'
											size='icon-sm'
											aria-label={`${row.name} tanlovini olib tashlash`}
											onClick={() => onRemove(row.id)}
										>
											<X aria-hidden='true' />
										</Button>
									</li>
								))}
							</ul>
						)}
					</section>
				</div>

				<DialogFooter className='shrink-0 items-start border-t px-5 py-4 sm:items-center sm:justify-between sm:px-6'>
					<p className='text-xs text-muted-foreground' role='status'>
						{sizeError ? 'Chop etish uchun yorliq o‘lchamini tekshiring.' : `${printable.length} ta yorliq tayyor`}
						{excluded > 0 && ` · ${excluded} tasi chop etilmaydi`}
					</p>
					<Button disabled={Boolean(sizeError) || printable.length === 0} onClick={() => printLabels(printable, size)}>
						<Printer aria-hidden='true' /> {sizeError || !printable.length ? 'Chop etish' : `${printable.length} ta yorliqni chop etish`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

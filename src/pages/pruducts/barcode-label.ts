import JsBarcode from 'jsbarcode'

const QUIET_ZONE_MODULES = 10
const MIN_MODULE_MM = 0.25
const PREFERRED_MODULE_MM = 0.375
const MIN_BAR_HEIGHT_MM = 7
const PT_TO_MM = 25.4 / 72

export const LABEL_PADDING_MM = 1.5
export const LABEL_GAP_MM = 0.7

export interface LabelSize {
	width: number
	height: number
	fontSize: number
}

export interface Barcode {
	value: string
	path: string
	modules: number
}

export function encodeBarcode(value?: string | null): Barcode | null {
	if (!value?.trim() || !/^[\x20-\x7E]+$/.test(value)) return null

	const result: { encodings?: { data: string }[] } = {}
	JsBarcode(result, value, { format: 'CODE128', displayValue: false, valid: () => {} })
	const pattern = result.encodings?.map(encoding => encoding.data).join('')
	if (!pattern) return null

	const path = Array.from(pattern.matchAll(/1+/g), match => {
		const start = QUIET_ZONE_MODULES + match.index
		const length = match[0].length
		return `M${start} 0h${length}v1h-${length}z`
	}).join(' ')

	return { value, path, modules: pattern.length + QUIET_ZONE_MODULES * 2 }
}

export function minLabelWidth(barcode: Barcode) {
	return barcode.modules * MIN_MODULE_MM + LABEL_PADDING_MM * 2
}

export function barcodeWidth(barcode: Barcode, labelWidth: number) {
	const availableWidth = labelWidth - LABEL_PADDING_MM * 2
	const preferredWidth = barcode.modules * PREFERRED_MODULE_MM
	return preferredWidth <= availableWidth ? preferredWidth : barcode.modules * MIN_MODULE_MM
}

export function labelNameLines({ height, fontSize }: LabelSize) {
	const codeLineHeight = preferredCodeTextSize(fontSize) * 1.15 * PT_TO_MM
	const reserved = LABEL_PADDING_MM * 2 + LABEL_GAP_MM * 2 + MIN_BAR_HEIGHT_MM + codeLineHeight
	return Math.min(3, Math.floor((height - reserved) / (fontSize * 1.2 * PT_TO_MM)))
}

function preferredCodeTextSize(fontSize: number) {
	return Math.min(10, fontSize * 0.8)
}

export function codeTextSize(barcode: Barcode, { width, fontSize }: LabelSize) {
	const availableWidth = width - LABEL_PADDING_MM * 2
	return Math.min(preferredCodeTextSize(fontSize), availableWidth / (barcode.value.length * 0.62 * PT_TO_MM))
}

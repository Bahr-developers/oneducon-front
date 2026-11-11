import type { product } from '@/@types'
import { productUtils } from '@/utils/products'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import EditProduct from './edit-products'

vi.mock('@/utils/products', () => ({
	productUtils: { patchProduct: vi.fn() },
}))
vi.mock('@/utils/categories', () => ({
	categoryUtils: { getCategory: async () => ({ data: [] }) },
}))
vi.mock('@/utils/units', () => ({
	unitUtils: { getUnit: async () => ({ data: [] }) },
}))
vi.mock('react-hot-toast', () => ({
	default: { success: vi.fn(), error: vi.fn() },
}))

const item: product = {
	id: '10', store_id: '1', name: 'Mahsulot', quantity: 10,
	category: { id: '1', name: 'Kategoriya', store_id: '1' },
	unit: { id: '1', name: 'Dona', store_id: '1' },
	reminder_quantity: 1, usd_rate: 12500, cost_price: 10000,
	cost_price_usd: 0.8, sale_price: 20000, sale_price_usd: 1.6,
	wholesale_price: 15000, count: 1, created_at: '',
}

const patchProduct = vi.mocked(productUtils.patchProduct)

function openEditor(initialProduct = item) {
	const queryClient = new QueryClient()
	const editor = (product: product) => (
		<QueryClientProvider client={queryClient}>
			<EditProduct product={product} showLabel />
		</QueryClientProvider>
	)
	const view = render(editor(initialProduct))
	fireEvent.click(screen.getByRole('button', { name: 'Tahrirlash' }))
	return { refreshProduct: (product: product) => view.rerender(editor(product)) }
}

afterEach(() => {
	cleanup()
	vi.resetAllMocks()
})

describe('Product barcode edits', () => {
	it('generates and saves a 12-digit barcode for an empty field', async () => {
		patchProduct.mockResolvedValueOnce({ message: 'yangilandi' })
		openEditor()
		const input = screen.getByRole<HTMLInputElement>('textbox', { name: 'Barcode' })
		const generator = screen.getByRole('button', { name: '12 raqamli barcode yaratish' })

		fireEvent.click(generator)
		const barcode = input.value
		expect(barcode).toMatch(/^\d{12}$/)
		expect(input).toHaveFocus()
		expect(generator).not.toBeInTheDocument()
		expect(patchProduct).not.toHaveBeenCalled()

		fireEvent.click(screen.getByRole('button', { name: 'Saqlash' }))
		await waitFor(() => expect(patchProduct).toHaveBeenCalledWith({ id: item.id, barcode }))
	})

	it('keeps an existing barcode and shows the generator when the field is cleared', () => {
		openEditor({ ...item, barcode: '0123456789012' })
		const input = screen.getByRole('textbox', { name: 'Barcode' })
		expect(input).toHaveValue('0123456789012')
		expect(screen.queryByRole('button', { name: '12 raqamli barcode yaratish' })).toBeNull()

		fireEvent.change(input, { target: { value: '' } })
		expect(screen.getByRole('button', { name: '12 raqamli barcode yaratish' })).toBeVisible()
	})
})

describe('Product stock edits', () => {
	it('sends only the edited field after another user receives stock', async () => {
		patchProduct.mockResolvedValueOnce({ message: 'yangilandi' })
		const { refreshProduct } = openEditor()
		fireEvent.change(screen.getByPlaceholderText('Mahsulot nomi'), { target: { value: 'Yangi nom' } })
		refreshProduct({ ...item, quantity: 15, cost_price: 11000 })
		fireEvent.click(screen.getByRole('button', { name: 'Saqlash' }))

		await waitFor(() => expect(patchProduct).toHaveBeenCalledWith({
			id: item.id,
			name: 'Yangi nom',
		}))
	})

	it('keeps the draft on refresh and checks the original stock when saving', async () => {
		patchProduct.mockResolvedValueOnce({ message: 'yangilandi' })
		const { refreshProduct } = openEditor()
		const quantity = screen.getByLabelText('Miqdori', { exact: true })
		fireEvent.change(quantity, { target: { value: '18' } })
		refreshProduct({ ...item, quantity: 15 })
		expect(quantity).toHaveValue('18')
		fireEvent.click(screen.getByRole('button', { name: 'Saqlash' }))

		await waitFor(() => expect(patchProduct).toHaveBeenCalledWith({
			id: item.id,
			quantity: 18,
			expected_quantity: 10,
		}))
	})

	it('lets the user review the current stock while preserving other changes', async () => {
		patchProduct.mockRejectedValueOnce({
			response: { data: { code: 'STOCK_QUANTITY_CONFLICT', current_quantity: 15 } },
		}).mockResolvedValueOnce({ message: 'yangilandi' })
		openEditor()
		const quantity = screen.getByLabelText('Miqdori', { exact: true })
		const name = screen.getByPlaceholderText('Mahsulot nomi')
		const save = screen.getByRole('button', { name: 'Saqlash' })
		fireEvent.change(name, { target: { value: 'Yangi nom' } })
		fireEvent.change(quantity, { target: { value: '18' } })
		fireEvent.click(save)

		expect(await screen.findByRole('alert')).toHaveTextContent('Hozirgi qoldiq 15')
		expect(save).toBeDisabled()
		fireEvent.click(screen.getByRole('button', { name: 'Joriy miqdorni olish' }))
		expect(quantity).toHaveValue('15')
		expect(name).toHaveValue('Yangi nom')

		fireEvent.change(quantity, { target: { value: '0' } })
		fireEvent.click(save)
		await waitFor(() => expect(patchProduct).toHaveBeenLastCalledWith({
			id: item.id,
			name: 'Yangi nom',
			quantity: 0,
			expected_quantity: 15,
		}))
	})
})

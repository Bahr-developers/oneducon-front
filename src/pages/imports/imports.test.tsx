import type { product } from '@/@types'
import { importUtils } from '@/utils/imports'
import { productUtils } from '@/utils/products'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ImportsPage from '.'

vi.mock('@/utils/imports', () => ({
	importUtils: { create: vi.fn(), getHistory: vi.fn() },
}))
vi.mock('@/utils/products', () => ({ productUtils: { getProducts: vi.fn() } }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

const selectedProduct: product = {
	id: '10', name: 'Mahsulot',
	category: { id: '1', name: 'Kategoriya', store_id: '1' },
	unit: { id: '1', name: 'Dona', store_id: '1' },
	store_id: '1', quantity: 20, reminder_quantity: 1,
	cost_price: 8000, sale_price: 10000,
	cost_price_usd: 0.64, sale_price_usd: 0.8,
	wholesale_price: 9500, usd_rate: 12500, count: 1, created_at: '',
}

beforeEach(() => {
	vi.clearAllMocks()
	vi.mocked(productUtils.getProducts).mockResolvedValue({ data: [selectedProduct] })
	vi.mocked(importUtils.getHistory).mockResolvedValue({
		success: true, data: [], total: 0, page: 1, limit: 10, totalPages: 0,
	})
	vi.mocked(importUtils.create).mockResolvedValue({
		success: true,
		data: { id: '1', total_price: 800000, note: null, store_id: '1', created_at: '', updated_at: '', import_items: [] },
	})
})

afterEach(cleanup)

async function selectProduct() {
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter><ImportsPage /></MemoryRouter>
		</QueryClientProvider>,
	)
	fireEvent.focus(screen.getByLabelText('Mahsulot qidirish'))
	fireEvent.click(await screen.findByRole('button', { name: /Mahsulot.*Omborda/ }))
}

describe('Import creation', () => {
	it('sends every price, including unchanged prices, in the new payload and resets after success', async () => {
		await selectProduct()
		expect(screen.getByLabelText('Mahsulot tannarxi (USD)')).toHaveValue('0.64')
		expect(screen.getByLabelText('Mahsulot sotuv narxi (USD)')).toHaveValue('0.8')
		fireEvent.change(screen.getByLabelText('Mahsulot miqdori'), { target: { value: '100' } })
		fireEvent.change(screen.getByLabelText('Izoh'), { target: { value: ' string ' } })
		fireEvent.click(screen.getByRole('button', { name: 'Kirimni saqlash' }))
		await waitFor(() => expect(importUtils.create).toHaveBeenCalledWith({
			items: [{ productId: 10, quantity: 100, costPrice: 8000, salePrice: 10000, costPriceUsd: 0.64, salePriceUsd: 0.8, wholesalePrice: 9500 }],
			note: 'string',
		}))
		await waitFor(() => expect(screen.getByText('Kirim ro‘yxati hozircha bo‘sh')).toBeInTheDocument())
	})

	it('preserves fractional USD values entered with a dot or comma', async () => {
		await selectProduct()
		const user = userEvent.setup()
		const cost = screen.getByLabelText('Mahsulot tannarxi (USD)')
		await user.clear(cost)
		await user.type(cost, '0.75')
		const sale = screen.getByLabelText('Mahsulot sotuv narxi (USD)')
		await user.clear(sale)
		await user.type(sale, '1,25')
		fireEvent.click(screen.getByRole('button', { name: 'Kirimni saqlash' }))
		await waitFor(() => expect(importUtils.create).toHaveBeenCalledWith(expect.objectContaining({
			items: [expect.objectContaining({ costPriceUsd: 0.75, salePriceUsd: 1.25 })],
		})))
	})

	it('requires USD prices and rejects negative or malformed input without changing its value', async () => {
		await selectProduct()
		const cost = screen.getByLabelText('Mahsulot tannarxi (USD)')
		for (const value of ['-1', '1.2.3', 'Infinity']) {
			fireEvent.change(cost, { target: { value } })
			expect(cost).toHaveValue('0.64')
		}
		fireEvent.change(cost, { target: { value: '' } })
		fireEvent.click(screen.getByRole('button', { name: 'Kirimni saqlash' }))
		expect(importUtils.create).not.toHaveBeenCalled()
		expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('USD narxlari'))
	})

	it('allows zero prices and sends an empty note', async () => {
		await selectProduct()
		for (const label of ['tannarxi (UZS)', 'tannarxi (USD)', 'sotuv narxi (UZS)', 'sotuv narxi (USD)', 'ulgurji narxi']) {
			fireEvent.change(screen.getByLabelText(`Mahsulot ${label}`), { target: { value: '0' } })
		}
		fireEvent.click(screen.getByRole('button', { name: 'Kirimni saqlash' }))
		await waitFor(() => expect(importUtils.create).toHaveBeenCalledWith({
			items: [{ productId: 10, quantity: 1, costPrice: 0, salePrice: 0, costPriceUsd: 0, salePriceUsd: 0, wholesalePrice: 0 }],
			note: '',
		}))
	})
})

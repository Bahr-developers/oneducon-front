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
		expect(screen.getByLabelText('Mahsulot USD kursi')).toHaveValue('12500')
		expect(screen.getByLabelText('Mahsulot tannarxi (USD)')).toHaveValue('0.64')
		expect(screen.getByLabelText('Mahsulot sotuv narxi (USD)')).toHaveValue('0.8')
		fireEvent.change(screen.getByLabelText('Mahsulot miqdori'), { target: { value: '100' } })
		fireEvent.change(screen.getByLabelText('Izoh'), { target: { value: ' string ' } })
		fireEvent.click(screen.getByRole('button', { name: 'Kirimni saqlash' }))
		await waitFor(() => expect(importUtils.create).toHaveBeenCalledWith({
			items: [{ usd_rate: 12500, productId: 10, quantity: 100, costPrice: 8000, salePrice: 10000, costPriceUsd: 0.64, salePriceUsd: 0.8, wholesalePrice: 9500 }],
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
		expect(screen.getByLabelText('Mahsulot tannarxi (UZS)')).toHaveValue('9375')
		const sale = screen.getByLabelText('Mahsulot sotuv narxi (USD)')
		await user.clear(sale)
		await user.type(sale, '1,25')
		expect(screen.getByLabelText('Mahsulot sotuv narxi (UZS)')).toHaveValue('15625')
		fireEvent.change(screen.getByLabelText('Mahsulot USD kursi'), { target: { value: '13000.5' } })
		expect(screen.getByLabelText('Mahsulot tannarxi (UZS)')).toHaveValue('9750')
		expect(screen.getByLabelText('Mahsulot sotuv narxi (UZS)')).toHaveValue('16251')
		expect(screen.getByLabelText('Mahsulot ulgurji narxi')).toHaveValue('9500')
		fireEvent.click(screen.getByRole('button', { name: 'Kirimni saqlash' }))
		await waitFor(() => expect(importUtils.create).toHaveBeenCalledWith(expect.objectContaining({
			items: [expect.objectContaining({ usd_rate: 13000.5, costPrice: 9750, salePrice: 16251, costPriceUsd: 0.75, salePriceUsd: 1.25 })],
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
		expect(screen.getByLabelText('Mahsulot tannarxi (UZS)')).toHaveValue('')
		fireEvent.click(screen.getByRole('button', { name: 'Kirimni saqlash' }))
		expect(importUtils.create).not.toHaveBeenCalled()
		expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('tannarx'))
	})

	it('allows zero prices and sends an empty note', async () => {
		await selectProduct()
		for (const label of ['tannarxi (UZS)', 'tannarxi (USD)', 'sotuv narxi (UZS)', 'sotuv narxi (USD)', 'ulgurji narxi']) {
			fireEvent.change(screen.getByLabelText(`Mahsulot ${label}`), { target: { value: '0' } })
		}
		fireEvent.click(screen.getByRole('button', { name: 'Kirimni saqlash' }))
		await waitFor(() => expect(importUtils.create).toHaveBeenCalledWith({
			items: [{ usd_rate: 12500, productId: 10, quantity: 1, costPrice: 0, salePrice: 0, costPriceUsd: 0, salePriceUsd: 0, wholesalePrice: 0 }],
			note: '',
		}))
	})

	it.each(['', '0'])('blocks submission with an invalid USD rate: %s', async value => {
		await selectProduct()
		fireEvent.change(screen.getByLabelText('Mahsulot USD kursi'), { target: { value } })
		expect(screen.getByLabelText('Mahsulot tannarxi (UZS)')).toHaveValue('8000')
		expect(screen.getByLabelText('Mahsulot sotuv narxi (UZS)')).toHaveValue('10000')
		fireEvent.click(screen.getByRole('button', { name: 'Kirimni saqlash' }))
		expect(importUtils.create).not.toHaveBeenCalled()
		expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('USD kursi'))
		fireEvent.change(screen.getByLabelText('Mahsulot USD kursi'), { target: { value: '15000' } })
		expect(screen.getByLabelText('Mahsulot tannarxi (UZS)')).toHaveValue('9600')
		expect(screen.getByLabelText('Mahsulot sotuv narxi (UZS)')).toHaveValue('12000')
	})

	it.each([
		['tannarxi', '9000', '0.72'],
		['sotuv narxi', '17501', '1.4'],
	])('converts %s from UZS to USD using the row rate', async (label, uzs, usd) => {
		await selectProduct()
		fireEvent.change(screen.getByLabelText(`Mahsulot ${label} (UZS)`), { target: { value: uzs } })
		expect(screen.getByLabelText(`Mahsulot ${label} (UZS)`)).toHaveValue(uzs)
		expect(screen.getByLabelText(`Mahsulot ${label} (USD)`)).toHaveValue(usd)
	})

	it('uses each product’s rate and updates only the edited row', async () => {
		vi.mocked(productUtils.getProducts).mockResolvedValue({ data: [
			selectedProduct,
			{ ...selectedProduct, id: '11', name: 'Boshqa', usd_rate: 10000 },
		] })
		await selectProduct()
		fireEvent.focus(screen.getByLabelText('Mahsulot qidirish'))
		fireEvent.click(await screen.findByRole('button', { name: /Boshqa.*Omborda/ }))
		fireEvent.change(screen.getByLabelText('Boshqa tannarxi (USD)'), { target: { value: '2' } })
		expect(screen.getByLabelText('Boshqa tannarxi (UZS)')).toHaveValue('20000')
		expect(screen.getByLabelText('Mahsulot tannarxi (UZS)')).toHaveValue('8000')
		fireEvent.change(screen.getByLabelText('Mahsulot USD kursi'), { target: { value: '15000' } })
		expect(screen.getByLabelText('Mahsulot tannarxi (UZS)')).toHaveValue('9600')
		expect(screen.getByLabelText('Boshqa tannarxi (UZS)')).toHaveValue('20000')
	})
})

import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import pagination from '@/store/paginationSlice'
import productSelection from '@/store/product-selection-slice'
import { productUtils } from '@/utils/products'
import ProductsTable from './product-table'

vi.mock('@/utils/products', () => ({ productUtils: { getProducts: vi.fn() } }))
vi.mock('@/utils/categories', () => ({ categoryUtils: { getCategory: async () => ({ data: [] }) } }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

const products = [
	{ id: '1', name: 'Sut', barcode: '0001' },
	{ id: '2', name: 'Qaymoq', barcode: '0002' },
	{ id: '3', name: 'Choy', barcode: '0003' },
	{ id: '4', name: 'Shakar', barcode: '0004' },
	{ id: '5', name: 'Tuz', barcode: '0005' },
	{ id: '6', name: 'Non', barcode: '0123456789012' },
	{ id: '7', name: 'Qatiq', barcode: null },
]

function openProducts() {
	const store = configureStore({
		reducer: { pagination, productSelection },
		preloadedState: { pagination: { postsPerPage: 5 } },
	})
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
	render(
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={['/dashboard/products']}>
					<Routes>
						<Route path='/dashboard/products' element={<ProductsTable />} />
						<Route path='/dashboard/products/:id' element={<Link to='/dashboard/products'>Mahsulotlarga qaytish</Link>} />
					</Routes>
				</MemoryRouter>
			</QueryClientProvider>
		</Provider>,
	)
}

beforeEach(() => {
	vi.mocked(productUtils.getProducts).mockImplementation(async ({ limit = 5, page = 1, search = '' }) => {
		const matches = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
		return { data: matches.slice((page - 1) * limit, page * limit), total: matches.length }
	})
})
afterEach(() => vi.restoreAllMocks())

it('preserves checks across pages, filtering and visiting product details', async () => {
	openProducts()

	fireEvent.click(await screen.findByRole('checkbox', { name: 'Sut ni tanlash' }))
	const pageSelection = screen.getByRole('checkbox', { name: 'Joriy sahifadagi mahsulotlarni tanlash' })
	expect(pageSelection).toHaveAttribute('aria-checked', 'mixed')

	fireEvent.click(screen.getByText('2', { selector: 'a' }))
	const bread = await screen.findByRole('checkbox', { name: 'Non ni tanlash' })
	fireEvent.click(pageSelection)
	expect(bread).toBeChecked()
	expect(screen.getByRole('status')).toHaveTextContent('3 ta mahsulot tanlangan')

	fireEvent.click(pageSelection)
	expect(screen.getByRole('checkbox', { name: 'Non ni tanlash' })).not.toBeChecked()
	expect(screen.getByRole('status')).toHaveTextContent('1 ta mahsulot tanlangan')
	fireEvent.click(screen.getByRole('checkbox', { name: 'Non ni tanlash' }))

	fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Sut' } })
	expect(await screen.findByRole('checkbox', { name: 'Sut ni tanlash' })).toBeChecked()
	expect(screen.getByRole('status')).toHaveTextContent('2 ta mahsulot tanlangan')

	fireEvent.click(screen.getByRole('link', { name: 'Ko‘rish' }))
	fireEvent.click(await screen.findByRole('link', { name: 'Mahsulotlarga qaytish' }))
	expect(await screen.findByRole('checkbox', { name: 'Sut ni tanlash' })).toBeChecked()
	expect(screen.getByRole('status')).toHaveTextContent('2 ta mahsulot tanlangan')

	fireEvent.click(screen.getByRole('button', { name: 'Tanlovni tozalash' }))
	expect(screen.getByRole('checkbox', { name: 'Sut ni tanlash' })).not.toBeChecked()
	expect(screen.getByRole('button', { name: 'Barcode print' })).toBeDisabled()
})

it('prints sized labels from different pages and lists unprintable products', async () => {
	openProducts()
	fireEvent.click(await screen.findByRole('checkbox', { name: 'Sut ni tanlash' }))
	fireEvent.click(screen.getByText('2', { selector: 'a' }))
	fireEvent.click(await screen.findByRole('checkbox', { name: 'Non ni tanlash' }))
	fireEvent.click(screen.getByRole('checkbox', { name: 'Qatiq ni tanlash' }))

	fireEvent.click(screen.getByRole('button', { name: 'Barcode print' }))
	const dialog = within(await screen.findByRole('dialog', { name: 'Barcode print' }))
	expect(dialog.getByText('Shtrix-kod yo‘q')).toBeVisible()

	fireEvent.change(dialog.getByRole('spinbutton', { name: 'Eni (mm)' }), { target: { value: '25' } })
	expect(dialog.getByText(/Eni kamida \d+ mm bo‘lishi kerak/)).toBeVisible()
	expect(dialog.getByRole('button', { name: '1 ta yorliqni chop etish' })).toBeEnabled()

	fireEvent.click(dialog.getByRole('button', { name: '50 × 30 mm' }))
	fireEvent.change(dialog.getByRole('spinbutton', { name: 'Matn kattaligi (pt)' }), { target: { value: '11' } })
	const printDocument = document.implementation.createHTMLDocument()
	const popup = { document: printDocument, addEventListener: vi.fn(), close: vi.fn(), focus: vi.fn(), print: vi.fn() }
	vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window)

	fireEvent.click(dialog.getByRole('button', { name: '2 ta yorliqni chop etish' }))
	expect(popup.print).toHaveBeenCalledOnce()
	expect(printDocument.querySelector('style')?.textContent).toContain('size: 50mm 30mm')
	const labels = Array.from(printDocument.querySelectorAll<HTMLElement>('.barcode-label'))
	expect(labels.map(label => label.textContent)).toEqual(['Sut0001', 'Non0123456789012'])
	expect(labels.every(label => label.querySelector('svg path')?.getAttribute('d'))).toBe(true)
	expect(labels[0].style.getPropertyValue('--label-font-size')).toBe('11pt')

	act(() => popup.addEventListener.mock.calls[0][1]())
})

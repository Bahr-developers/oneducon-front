import type { product } from '@/@types'
import customAxios from '@/services'
import orderReducer, { addProductToOrder, removePayment } from '@/store/order-slice'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { it, expect, vi } from 'vitest'
import OrderProducts from '.'

vi.mock('@/services', () => ({ default: { get: vi.fn(), post: vi.fn() } }))
vi.mock('@/utils/payment-type', () => ({
	paymentUtils: { getPayments: async () => ({ data: [] }) },
}))
vi.mock('@/utils/customer', () => ({
	customerUtils: {
		getCustomerAll: async () => ({ data: [{ id: '3', name: 'Test mijoz', phone: '901234567' }] }),
	},
}))
vi.mock('react-i18next', () => ({
	useTranslation: () => ({ i18n: { language: 'uz' }, t: (key: string) => key }),
}))

it('saves a credit sale without a return date and opens the store receipt', async () => {
	const store = configureStore({ reducer: { order: orderReducer } })
	const queryClient = new QueryClient()
	vi.mocked(customAxios.get).mockResolvedValueOnce({
		data: { success: true, data: { name: 'Test do‘kon' } },
	})
	vi.mocked(customAxios.post).mockResolvedValueOnce({
		data: {
			success: true,
			data: {
				id: '20',
				order_number: 57,
				created_at: '2026-11-11T07:15:00.000Z',
				store_id: '1',
				items: [{ product_id: 10, count: 1, price: 10000, discount: 0, name: 'Saqlangan mahsulot' }],
			},
		},
	})

	const item: product = {
		id: '10', name: 'Test mahsulot', store_id: '1', quantity: 10,
		category: { id: '1', name: 'Kategoriya', store_id: '1' },
		unit: { id: '1', name: 'Dona', store_id: '1' },
		reminder_quantity: 0, cost_price: 8000, sale_price: 10000,
		cost_price_usd: 0.64, sale_price_usd: 0.8, usd_rate: 12500,
		wholesale_price: null, count: 1, created_at: '',
	}
	store.dispatch(addProductToOrder(item))
	store.dispatch(removePayment(0))

	render(
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<OrderProducts />
			</QueryClientProvider>
		</Provider>,
	)

	const save = screen.getByRole('button', { name: 'Buyurtmani saqlash' })
	expect(save).toBeDisabled()
	fireEvent.change(screen.getByPlaceholderText('Mijozni qidiring...'), { target: { value: 'Test' } })
	fireEvent.click(await screen.findByText('Test mijoz'))
	expect(save).toBeEnabled()
	fireEvent.click(save)

	await waitFor(() => expect(customAxios.post).toHaveBeenCalledWith('orders', expect.objectContaining({
		client_id: 3,
		debts: [{ client_id: 3, price: 10000, reminder: '' }],
	})))
	const receiptDialog = await screen.findByRole('dialog', { name: 'Sotuv cheki' })
	expect(receiptDialog).toBeVisible()
	expect(await screen.findByText('Test do‘kon')).toBeVisible()
	expect(customAxios.get).toHaveBeenCalledWith('stores/1')
	expect(screen.queryByText('Adukon')).not.toBeInTheDocument()
	expect(receiptDialog.querySelector('img')).toBeNull()
	expect(screen.getByText('Saqlangan mahsulot')).toBeVisible()
	expect(screen.getByText('57')).toBeVisible()
	expect(screen.getByText('Qarz summasi')).toBeVisible()
	expect(screen.getByRole('button', { name: 'Chop etish' })).toBeEnabled()
})

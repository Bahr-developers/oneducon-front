import { configureStore } from '@reduxjs/toolkit'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider, useSelector } from 'react-redux'
import { afterEach, describe, expect, it } from 'vitest'
import type { product } from '@/@types'
import orderReducer, { addProductToOrder, updateOrderItem } from '@/store/order-slice'
import OrderItem from './order-item'

afterEach(cleanup)

const productFixture: product = {
	id: '1',
	name: 'Mahsulot',
	category: { id: '1', name: 'Kategoriya', store_id: '1' },
	unit: { id: '1', name: 'Dona', store_id: '1' },
	store_id: '1',
	quantity: 100,
	reminder_quantity: 1,
	cost_price: 50000,
	cost_price_usd: 4,
	sale_price: 100000,
	sale_price_usd: 8,
	usd_rate: 12500,
	count: 1,
	created_at: '',
	wholesale_price: 80000,
}

function renderOrderItem(count = 5) {
	const store = configureStore({ reducer: { order: orderReducer } })
	store.dispatch(addProductToOrder(productFixture))
	const id = store.getState().order.items[0].id
	store.dispatch(updateOrderItem({ id, updates: { count } }))

	function OrderItemWithState() {
		const item = useSelector((state: ReturnType<typeof store.getState>) => state.order.items[0])
		return <OrderItem item={item} constPrice={false} />
	}

	render(<Provider store={store}><OrderItemWithState /></Provider>)

	return {
		store,
		input: screen.getByLabelText('Chegirmadan keyingi summa'),
	}
}

describe('Order item final total', () => {
	it('converts the entered line total to a per-item discount and updates order totals', () => {
		const { store, input } = renderOrderItem()
		expect(input).toHaveValue('500 000')
		expect(screen.queryByRole('button', { name: '%' })).not.toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'UZS' })).not.toBeInTheDocument()

		fireEvent.change(input, { target: { value: '450000' } })

		expect(input).toHaveValue('450 000')
		expect(store.getState().order.items[0].discount).toBe(10000)
		expect(store.getState().order.totalItemsAmount).toBe(450000)
	})

	it('supports typing a total with a repeating per-item discount', async () => {
		const { store, input } = renderOrderItem(3)
		const user = userEvent.setup()
		await user.clear(input)
		await user.type(input, '250000.25')

		expect(input).toHaveValue('250 000.25')
		expect(store.getState().order.totalItemsAmount).toBeCloseTo(250000.25)
	})

	it('calculates discounts for fractional quantities', () => {
		const { store, input } = renderOrderItem(2.5)
		fireEvent.change(input, { target: { value: '225000' } })
		expect(input).toHaveValue('225 000')
		expect(store.getState().order.items[0].discount).toBe(10000)
		expect(store.getState().order.totalItemsAmount).toBe(225000)
	})

	it('allows zero totals and caps totals at the original subtotal', () => {
		const { store, input } = renderOrderItem()
		fireEvent.change(input, { target: { value: '600000' } })
		expect(input).toHaveValue('500 000')
		fireEvent.change(input, { target: { value: '0' } })
		expect(store.getState().order.items[0].discount).toBe(100000)
		expect(store.getState().order.totalItemsAmount).toBe(0)

		fireEvent.change(input, { target: { value: '600000' } })
		expect(input).toHaveValue('500 000')
		expect(store.getState().order.items[0].discount).toBe(0)
		expect(store.getState().order.totalItemsAmount).toBe(500000)
	})

	it('updates the displayed total when quantity or wholesale pricing changes', () => {
		const { store, input } = renderOrderItem()
		fireEvent.change(input, { target: { value: '450000' } })
		const quantityInput = screen.getAllByRole('textbox')[0]
		fireEvent.change(quantityInput, { target: { value: '2' } })
		expect(input).toHaveValue('180 000')

		fireEvent.click(screen.getByRole('switch', { name: 'Ulgurji narx' }))
		expect(input).toHaveValue('140 000')
		expect(store.getState().order.totalItemsAmount).toBe(140000)
	})

	it('avoids division by zero while the quantity is empty', () => {
		const { store, input } = renderOrderItem()
		const quantityInput = screen.getAllByRole('textbox')[0]
		fireEvent.change(quantityInput, { target: { value: '' } })
		expect(input).toBeDisabled()
		expect(store.getState().order.totalItemsAmount).toBe(0)
		fireEvent.blur(quantityInput)
		expect(input).toBeEnabled()
		expect(input).toHaveValue('100 000')
	})

	it('keeps totals nonnegative when switching to a lower wholesale price', () => {
		const { store, input } = renderOrderItem()
		fireEvent.change(input, { target: { value: '25000' } })
		fireEvent.click(screen.getByRole('switch', { name: 'Ulgurji narx' }))
		expect(store.getState().order.items[0].discount).toBe(80000)
		expect(store.getState().order.totalItemsAmount).toBe(0)
	})
})

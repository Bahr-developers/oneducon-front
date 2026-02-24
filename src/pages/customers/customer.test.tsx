// src/pages/customers/customer.test.tsx
import { render, screen, waitFor } from '@testing-library/react'

import * as customerApi from '@/utils/customer'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import Customers from '.'
import { createWrapper } from '@/test'

vi.mock('react-hot-toast', () => ({
	default: { success: vi.fn(), error: vi.fn() },
}))

beforeAll(() => {
	Object.defineProperty(window, 'localStorage', {
		value: {
			getItem: vi.fn(() => '1'),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn(),
		},
		writable: true,
	})
})

describe('Customers component simple test', () => {
	it('renders customer table with mock data', async () => {
		// Mock API
		vi.spyOn(customerApi.customerUtils, 'getCustomer').mockResolvedValue({
			data: [
				{ id: '1', name: 'Ali', phone: '+998901234567' },
				{ id: '2', name: 'Vali', phone: '+998901112233' },
			],
			total: 2,
		})

		render(
			<MemoryRouter>
				<Customers />
			</MemoryRouter>,
			{ wrapper: createWrapper() },
		)

		// H1 element tekshirish
		expect(screen.getByText(/Mijozlar/i)).toBeInTheDocument()

		// Kutish va table render bo‘lishini tekshirish
		await waitFor(() => {
			expect(screen.getByText('Ali')).toBeInTheDocument()
			expect(screen.getByText('Vali')).toBeInTheDocument()
		})
	})
})

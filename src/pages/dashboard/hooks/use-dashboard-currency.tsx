import type { DashboardCurrency } from '@/@types/dash-stats'
import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react'

interface DashboardCurrencyContextValue {
	currency: DashboardCurrency
	isUsd: boolean
	setCurrency: (currency: DashboardCurrency) => void
	toggleCurrency: () => void
}

const DashboardCurrencyContext =
	createContext<DashboardCurrencyContextValue | null>(null)

export function DashboardCurrencyProvider({
	children,
}: {
	children: ReactNode
}) {
	const [currency, setCurrency] = useState<DashboardCurrency>('UZS')

	const value = useMemo(
		() => ({
			currency,
			isUsd: currency === 'USD',
			setCurrency,
			toggleCurrency: () =>
				setCurrency(prev => (prev === 'UZS' ? 'USD' : 'UZS')),
		}),
		[currency],
	)

	return (
		<DashboardCurrencyContext.Provider value={value}>
			{children}
		</DashboardCurrencyContext.Provider>
	)
}

export function useDashboardCurrency() {
	const ctx = useContext(DashboardCurrencyContext)
	if (!ctx) {
		throw new Error(
			'useDashboardCurrency must be used within DashboardCurrencyProvider',
		)
	}
	return ctx
}

import {
	getByPayment,
	getCategoryTopSold,
	getLastTransaction,
	getProductTopSold,
	StatisticsResponse,
} from '@/@types/dash-stats'
import customAxios from '@/services'

export interface DashboardRequestParams {
	params: {
		from?: string
		to?: string
		limit?: string | number
		page?: string | number
	}
}

function unwrapList<T>(payload: T[] | { data: T[] }): T[] {
	if (Array.isArray(payload)) return payload
	return payload?.data ?? []
}

export const dashboardUtils = {
	/** Sotuv turlari bo'yicha */
	statsbyPayment: async ({
		params,
	}: DashboardRequestParams): Promise<getByPayment[]> => {
		const { data } = await customAxios.get<getByPayment[] | { data: getByPayment[] }>(
			'stores/stats-by-payment-types',
			{ params },
		)
		return unwrapList(data)
	},

	/** So'nggi tranzaksiyalar */
	statsLastTransaction: async ({
		params,
	}: DashboardRequestParams): Promise<getLastTransaction> => {
		const { data } = await customAxios.get<getLastTransaction>('payments', {
			params,
		})
		return data
	},

	/** Umumiy do'kon statistikasi (date filter bilan) */
	getGeneralStats: async ({
		params,
	}: DashboardRequestParams): Promise<StatisticsResponse> => {
		const { data } = await customAxios.get<
			StatisticsResponse | { data: StatisticsResponse }
		>('stores/stats', { params })

		if (data && typeof data === 'object' && 'totalSalePrices' in data) {
			return data
		}
		if (data && typeof data === 'object' && 'data' in data) {
			return data.data
		}
		return {
			totalOrders: 0,
			totalPayments: 0,
			totalDebts: 0,
			totalCashBalance: 0,
			cashOnHand: 0,
			totalCostPrices: 0,
			totalCostPricesUsd: 0,
			totalSalePrices: 0,
			totalSalePricesUsd: 0,
		}
	},

	/** Eng ko'p sotilgan mahsulotlar */
	getProductTopSold: async ({
		params,
	}: DashboardRequestParams): Promise<getProductTopSold[]> => {
		const { data } = await customAxios.get<
			getProductTopSold[] | { data: getProductTopSold[] }
		>('products/top-sold', { params })
		return unwrapList(data)
	},

	/**
	 * Eng ko'p sotilgan kategoriyalar.
	 * NOTE: hozir backend product endpointiga ulangan; hook mock'ga fallback qiladi.
	 */
	getCategoryTopSold: async ({
		params,
	}: DashboardRequestParams): Promise<getCategoryTopSold[]> => {
		const { data } = await customAxios.get<
			getCategoryTopSold[] | { data: getCategoryTopSold[] }
		>('categories/top-sold', { params })
		return unwrapList(data)
	},
}

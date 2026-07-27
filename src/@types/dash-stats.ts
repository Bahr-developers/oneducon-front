export interface getByPayment {
	payment_type_id: string
	payment_type_name: string
	total_price: number
}

export interface LastTransactionItem {
	id: string
	price: number
	payment_type_id: string
	order_id: string
	store_id: string
	created_at: string
	updated_at: string
	payment_type: PaymentType
}

export interface PaymentType {
	id: string
	name: string
	created_at: string
	updated_at: string
}

export interface getLastTransaction {
	success: boolean
	data: LastTransactionItem[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface StatisticsResponse {
	totalOrders: number
	totalPayments: number
	totalDebts: number
	totalCashBalance: number
	cashOnHand: number
	totalCostPrices: number
	totalCostPricesUsd: number
	totalSalePrices: number
	totalSalePricesUsd: number
}

export interface getProductTopSold {
	productId: string
	productName: string
	soldCount: number
	totalSoldPrice: number
}

export interface getCategoryTopSold {
	categoryId: string
	categoryName: string
	totalSoldPrice: number
}

/** UI-level KPI card (API + mock trend) */
export interface DashboardStatCard {
	id: string
	title: string
	value: number
	currency: 'UZS' | 'USD'
	trendPercent?: number
	trendLabel?: string
	iconTone: 'purple' | 'blue' | 'green' | 'red' | 'orange'
}

export interface SalesDynamicsPoint {
	label: string
	current: number
	previous: number
}

export interface SalesChannelItem {
	id: string
	name: string
	value: number
	percent: number
	fill: string
}

export interface BranchSaleItem {
	id: string
	name: string
	total: number
	growth: number
}

export interface TopCategoryMockItem {
	id: string
	name: string
	totalSoldPrice: number
	color: string
}

export type DashboardCurrency = 'UZS' | 'USD'
export type SalesDynamicsPeriod = 'week' | 'month' | 'year'

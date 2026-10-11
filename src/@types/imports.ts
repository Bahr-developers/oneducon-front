import type { product } from './index'

export interface ImportItemDraft {
	product: product
	quantity: string
	costPrice: string
	salePrice: string
	wholesalePrice: string
}

export interface ImportDetailItem {
	id: string
	import_id: string
	product_id: string
	quantity: number
	cost_price: number
	total_price: number
	created_at: string
	product: product
}

export interface CreateImportItem {
	productId: number
	quantity: number
	costPrice: number
	salePrice?: number
	wholesalePrice?: number
}

export interface CreateImportPayload {
	items: CreateImportItem[]
	note?: string
}

export interface ImportHistoryItem {
	id: string
	total_price: number
	note: string | null
	store_id: string
	created_at: string
	updated_at: string
	_count: {
		import_items: number
	}
}

export interface ImportHistoryResponse {
	success: boolean
	data: ImportHistoryItem[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface ImportDetails {
	id: string
	total_price: number
	note: string | null
	store_id: string
	created_at: string
	updated_at: string
	import_items: ImportDetailItem[]
}

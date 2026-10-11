import type { product } from './index'

export interface ProductDetailsResponse {
	success: boolean
	data: product
}

export interface InventoryMovementRelation {
	id: string
	note: string | null
	order_number?: number
}

export interface InventoryMovement {
	id: string
	product_id: string
	store_id: string
	type: string
	quantity: number
	cost_price: number | null
	import_id: string | null
	order_id: string | null
	note: string | null
	created_at: string
	import: InventoryMovementRelation | null
	order: InventoryMovementRelation | null
}

export interface InventoryMovementsResponse {
	success: boolean
	data: InventoryMovement[]
	total: number
	page: number
	limit: number
	totalPages: number
}

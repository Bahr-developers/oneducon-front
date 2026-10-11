import type {
	CreateImportPayload,
	ImportDetails,
	ImportHistoryResponse,
} from '@/@types/imports'
import customAxios from '@/services'

interface ImportHistoryParams {
	page?: number
	limit?: number
	from?: string
	to?: string
}

export const importUtils = {
	create: async (payload: CreateImportPayload) => {
		const { data } = await customAxios.post<{ success: boolean; data: ImportDetails }>(
			'imports',
			payload,
		)
		return data
	},

	getHistory: async ({ page, limit, from, to }: ImportHistoryParams) => {
		const params = new URLSearchParams()
		if (page) params.set('page', String(page))
		if (limit) params.set('limit', String(limit))
		if (from) params.set('from', from)
		if (to) params.set('to', to)

		const { data } = await customAxios.get<ImportHistoryResponse>(
			`imports?${params.toString()}`,
		)
		return data
	},

	getById: async (id: string) => {
		const { data } = await customAxios.get<{ success: boolean; data: ImportDetails }>(
			`imports/${id}`,
		)
		return data
	},
}

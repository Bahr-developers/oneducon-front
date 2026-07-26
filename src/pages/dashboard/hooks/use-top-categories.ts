import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { dashboardUtils } from '@/utils/dashboard'
import {
	DASHBOARD_STALE_TIME,
	TOP_CATEGORIES_MOCK,
} from '../constants/dashboard.mock'
import { useDashboardDate } from './use-dashboard-date'

export function useTopCategories() {
	const { backendFrom, backendTo } = useDashboardDate()

	return useQuery({
		queryKey: ['dashboard_top_categories', backendFrom, backendTo],
		queryFn: async () => {
			try {
				const data = await dashboardUtils.getCategoryTopSold({
					params: { from: backendFrom, to: backendTo },
				})
				const isValidCategory =
					data?.length > 0 &&
					typeof data[0] === 'object' &&
					'categoryId' in data[0] &&
					'categoryName' in data[0]

				if (!isValidCategory) return TOP_CATEGORIES_MOCK

				return data.map((item, index) => ({
					id: item.categoryId,
					name: item.categoryName,
					totalSoldPrice: item.totalSoldPrice,
					color: TOP_CATEGORIES_MOCK[index % TOP_CATEGORIES_MOCK.length].color,
				}))
			} catch {
				return TOP_CATEGORIES_MOCK
			}
		},
		staleTime: DASHBOARD_STALE_TIME,
		placeholderData: keepPreviousData,
	})
}

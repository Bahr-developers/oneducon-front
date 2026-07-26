import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { dashboardUtils } from '@/utils/dashboard'
import { DASHBOARD_STALE_TIME } from '../constants/dashboard.mock'
import { useDashboardDate } from './use-dashboard-date'

export function useTopProducts() {
	const { backendFrom, backendTo } = useDashboardDate()

	return useQuery({
		queryKey: ['dashboard_top_products', backendFrom, backendTo],
		queryFn: () =>
			dashboardUtils.getProductTopSold({
				params: { from: backendFrom, to: backendTo },
			}),
		staleTime: DASHBOARD_STALE_TIME,
		placeholderData: keepPreviousData,
	})
}

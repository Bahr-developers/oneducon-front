import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { dashboardUtils } from '@/utils/dashboard'
import { DASHBOARD_STALE_TIME } from '../constants/dashboard.mock'
import { useDashboardDate } from './use-dashboard-date'

export function useGeneralStats() {
	const { backendFrom, backendTo } = useDashboardDate()
	return useQuery({
		queryKey: ['dashboard_general_stats', backendFrom, backendTo],
		queryFn: () =>
			dashboardUtils.getGeneralStats({
				params: { from: backendFrom, to: backendTo },
			}),
		staleTime: DASHBOARD_STALE_TIME,
		placeholderData: keepPreviousData,
	})
}

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { dashboardUtils } from '@/utils/dashboard'
import { DASHBOARD_STALE_TIME } from '../constants/dashboard.mock'
import { useDashboardDate } from './use-dashboard-date'

const DEFAULT_LIMIT = 8

export function useLastTransactions(limit = DEFAULT_LIMIT) {
	const { backendFrom, backendTo } = useDashboardDate()

	return useQuery({
		queryKey: ['dashboard_last_transactions', backendFrom, backendTo, limit],
		queryFn: () =>
			dashboardUtils.statsLastTransaction({
				params: { from: backendFrom, to: backendTo, limit, page: 1 },
			}),
		staleTime: DASHBOARD_STALE_TIME,
		placeholderData: keepPreviousData,
	})
}

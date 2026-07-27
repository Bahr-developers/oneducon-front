import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { dashboardUtils } from '@/utils/dashboard'
import { DASHBOARD_STALE_TIME } from '../constants/dashboard.mock'
import { useDashboardDate } from './use-dashboard-date'

export function usePaymentStats() {
	const { backendFrom, backendTo } = useDashboardDate()

	return useQuery({
		queryKey: ['dashboard_payment_stats', backendFrom, backendTo],
		queryFn: () =>
			dashboardUtils.statsbyPayment({
				params: { from: backendFrom, to: backendTo },
			}),
		staleTime: DASHBOARD_STALE_TIME,
		placeholderData: keepPreviousData,
	})
}

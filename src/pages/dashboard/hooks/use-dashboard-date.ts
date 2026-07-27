import { formatLocalDate } from '@/components/functions/format-locale-date'
import { useQueryParams } from '@/hooks/query-params'
import { useCallback, useMemo } from 'react'

const today = () => formatLocalDate(new Date())

const parseDate = (value: string) => {
	const [year, month, day] = value.split('-').map(Number)
	if (!year || !month || !day) return undefined
	return new Date(year, month - 1, day)
}

/** Sales page bilan bir xil: local 00:00 → ISO (masalan 2026-06-30T19:00:00.000Z) */
const toBackendISO = (dateStr: string, endOfRange = false) => {
	const d = new Date(dateStr)
	d.setHours(0, 0, 0, 0)
	if (endOfRange) {
		d.setDate(d.getDate() + 1)
	}
	return d.toISOString()
}

export function useDashboardDate() {
	const { getParam, updateURL } = useQueryParams()

	const from = getParam('from') || today()
	const to = getParam('to') || today()

	const fromDate = useMemo(() => parseDate(from), [from])
	const toDate = useMemo(() => parseDate(to), [to])

	const backendFrom = useMemo(() => toBackendISO(from), [from])
	const backendTo = useMemo(() => toBackendISO(to, true), [to])

	const setRange = useCallback(
		(nextFrom?: Date, nextTo?: Date) => {
			updateURL({
				from: nextFrom ? formatLocalDate(nextFrom) : from,
				to: nextTo ? formatLocalDate(nextTo) : to,
			})
		},
		[from, to, updateURL],
	)

	const setFrom = useCallback(
		(date?: Date) => {
			if (!date) return
			updateURL({ from: formatLocalDate(date), to })
		},
		[to, updateURL],
	)

	const setTo = useCallback(
		(date?: Date) => {
			if (!date) return
			updateURL({ from, to: formatLocalDate(date) })
		},
		[from, updateURL],
	)

	return {
		from,
		to,
		fromDate,
		toDate,
		backendFrom,
		backendTo,
		setFrom,
		setTo,
		setRange,
	}
}

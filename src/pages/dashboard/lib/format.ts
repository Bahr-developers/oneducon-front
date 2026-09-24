import type { DashboardCurrency } from '@/@types/dash-stats'

function getUsdRate(): number {
	const raw = localStorage.getItem('usd_rate')
	if (!raw) return 12_500
	try {
		const parsed = Number(JSON.parse(raw))
		if (Number.isFinite(parsed) && parsed > 0) return parsed
	} catch {
		const asNumber = Number(raw)
		if (Number.isFinite(asNumber) && asNumber > 0) return asNumber
	}
	return 12_500
}

/** UZS summani tanlangan valyutaga o'tkazish (API faqat UZS qaytarsa) */
export function toDisplayAmount(
	uzsAmount: number,
	currency: DashboardCurrency,
): number {
	const amount = Number.isFinite(uzsAmount) ? uzsAmount : 0
	if (currency === 'UZS') return amount
	return amount / getUsdRate()
}

export function formatMoney(
	value: number,
	currency: DashboardCurrency = 'UZS',
): string {
	const amount = Number.isFinite(value) ? value : 0
	const formatted = amount.toLocaleString('uz-UZ', {
		minimumFractionDigits: currency === 'USD' ? 2 : 0,
		maximumFractionDigits: currency === 'USD' ? 2 : 0,
	})
	return `${formatted} ${currency}`
}

export function formatCompactMoney(
	value: number,
	currency: DashboardCurrency = 'UZS',
): string {
	const amount = Number.isFinite(value) ? value : 0

	const formatted =
		currency === 'USD'
			? amount
				.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
				.replace(/,/g, ' ')
			: Math.trunc(amount)
				.toLocaleString('en-US')
				.replace(/,/g, ' ')

	return currency === 'USD'
		? `${formatted} $`
		: `${formatted} so‘m`
}

export function formatTrend(percent: number): string {
	const sign = percent > 0 ? '+' : ''
	return `${sign}${percent.toFixed(1)}%`
}

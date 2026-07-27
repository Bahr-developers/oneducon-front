import type {
	BranchSaleItem,
	SalesChannelItem,
	SalesDynamicsPoint,
	TopCategoryMockItem,
} from '@/@types/dash-stats'

export const DASHBOARD_STALE_TIME = 60_000

export const STAT_TRENDS = {
	sales: 12.5,
	expense: 8.7,
	profit: 15.3,
	returns: -6.2,
} as const

/** Qaytarishlar API hali yo'q — UI uchun placeholder */
export const MOCK_RETURNS_UZS = 2_450_000
export const MOCK_RETURNS_USD = 190

export const SALES_DYNAMICS_MONTH: SalesDynamicsPoint[] = [
	{ label: 'Yan', current: 95_000_000, previous: 70_000_000 },
	{ label: 'Fev', current: 110_000_000, previous: 85_000_000 },
	{ label: 'Mar', current: 125_000_000, previous: 95_000_000 },
	{ label: 'Apr', current: 118_000_000, previous: 100_000_000 },
	{ label: 'May', current: 145_000_000, previous: 112_000_000 },
	{ label: 'Iyun', current: 160_000_000, previous: 120_000_000 },
	{ label: 'Iyul', current: 195_000_000, previous: 140_000_000 },
]

export const SALES_DYNAMICS_WEEK: SalesDynamicsPoint[] = [
	{ label: 'Du', current: 22_000_000, previous: 18_000_000 },
	{ label: 'Se', current: 28_000_000, previous: 20_000_000 },
	{ label: 'Ch', current: 25_000_000, previous: 22_000_000 },
	{ label: 'Pa', current: 32_000_000, previous: 24_000_000 },
	{ label: 'Ju', current: 30_000_000, previous: 26_000_000 },
	{ label: 'Sha', current: 38_000_000, previous: 28_000_000 },
	{ label: 'Ya', current: 20_000_000, previous: 16_000_000 },
]

export const SALES_DYNAMICS_YEAR: SalesDynamicsPoint[] = [
	{ label: '2021', current: 980_000_000, previous: 720_000_000 },
	{ label: '2022', current: 1_150_000_000, previous: 980_000_000 },
	{ label: '2023', current: 1_420_000_000, previous: 1_150_000_000 },
	{ label: '2024', current: 1_680_000_000, previous: 1_420_000_000 },
	{ label: '2025', current: 1_950_000_000, previous: 1_680_000_000 },
]

export const SALES_CHANNELS_MOCK: SalesChannelItem[] = [
	{
		id: 'store',
		name: "Do'kon savdosi",
		value: 114_068_916,
		percent: 58.5,
		fill: '#5C59E8',
	},
	{
		id: 'online',
		name: 'Onlayn savdo',
		value: 47_382_473,
		percent: 24.3,
		fill: '#38BDF8',
	},
	{
		id: 'telegram',
		name: 'Telegram',
		value: 18_914_091,
		percent: 9.7,
		fill: '#22C55E',
	},
	{
		id: 'instagram',
		name: 'Instagram',
		value: 8_969_522,
		percent: 4.6,
		fill: '#F59E0B',
	},
	{
		id: 'other',
		name: 'Boshqalar',
		value: 5_654_598,
		percent: 2.9,
		fill: '#94A3B8',
	},
]

export const BRANCH_SALES_MOCK: BranchSaleItem[] = [
	{ id: '1', name: "Asosiy do'kon", total: 85_420_000, growth: 12.5 },
	{ id: '2', name: 'Filial Chilonzor', total: 42_180_000, growth: 8.3 },
	{ id: '3', name: 'Filial Yunusobod', total: 35_670_000, growth: -2.1 },
	{ id: '4', name: 'Filial Sergeli', total: 21_450_000, growth: 15.8 },
	{ id: '5', name: 'Filial Olmazor', total: 10_269_600, growth: 5.4 },
]

export const TOP_CATEGORIES_MOCK: TopCategoryMockItem[] = [
	{
		id: '1',
		name: 'Avto ehtiyot qismlar',
		totalSoldPrice: 68_450_000,
		color: '#5C59E8',
	},
	{
		id: '2',
		name: 'Motor moylari',
		totalSoldPrice: 42_180_000,
		color: '#38BDF8',
	},
	{
		id: '3',
		name: 'Aksessuarlar',
		totalSoldPrice: 28_960_000,
		color: '#22C55E',
	},
	{
		id: '4',
		name: 'Shinalar',
		totalSoldPrice: 21_340_000,
		color: '#F59E0B',
	},
	{
		id: '5',
		name: 'Elektronika',
		totalSoldPrice: 14_280_000,
		color: '#EF4444',
	},
]

export const PAYMENT_CHART_COLORS = [
	'#5C59E8',
	'#38BDF8',
	'#22C55E',
	'#F59E0B',
	'#94A3B8',
] as const

export const DASHBOARD_ACCENT = '#5C59E8'

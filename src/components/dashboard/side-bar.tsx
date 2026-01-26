import { cn } from '@/lib/utils'
import {
	BadgeDollarSign,
	BadgePlus,
	ChevronLeft,
	ChevronRight,
	House,
	LucideIcon,
	PackageSearch,
	Kanban,
	ScanBarcode,
	Users,
	Combine,
	Expand,
} from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ScrollArea } from '../ui/scroll-area'
import { useTranslation } from 'react-i18next'
import { CustomTooltip } from '../functions/hover-text'
import imagelogo from '@/assets/images/logo.png'
type NavItem = {
	labelKey: string
	href: string
	icon: LucideIcon
	allowedStores?: string[]
}
function useNavItems(): NavItem[] {
	// 1. Store ID ni olamiz (agar null bo'lsa bo'sh string qaytaradi)
	const storeId = localStorage.getItem('storeId') || ''

	// 2. Barcha menyu elementlari ro'yxati (Config)
	const allNavItems: NavItem[] = [
		{
			labelKey: 'Asosiy panel',
			href: '/dashboard',
			icon: House,
		},
		{
			labelKey: 'Buyurtma berish',
			href: '/dashboard/orders',
			icon: BadgePlus,
		},
		{
			labelKey: 'Buyurtma new',
			href: '/dashboard/order-new',
			icon: BadgePlus,
			allowedStores: ['1', '4'], // <--- DIQQAT: Faqat 1 va 4 storeId uchun
		},
		{
			labelKey: 'Sotuvlar',
			href: '/dashboard/selers',
			icon: BadgeDollarSign,
		},
		{
			labelKey: 'Xarajatlar',
			href: '/dashboard/expenses',
			icon: Expand,
		},
		{
			labelKey: 'Qarzlar',
			href: '/dashboard/debts',
			icon: Kanban,
		},
		{
			labelKey: 'Mahsulotlar',
			href: '/dashboard/products',
			icon: PackageSearch,
		},
		{
			labelKey: 'Kam qolgan mahsulotlar',
			href: '/dashboard/low-products',
			icon: ScanBarcode,
		},
		{
			labelKey: 'Mijozlar',
			href: '/dashboard/customers',
			icon: Users,
		},
		{
			labelKey: 'Birliklar',
			href: '/dashboard/units',
			icon: Combine,
		},
	]

	// 3. Filtrlash logikasi
	return allNavItems.filter(item => {
		// Agar allowedStores yozilmagan bo'lsa, hammaga ko'rinsin
		if (!item.allowedStores) return true

		// Agar allowedStores yozilgan bo'lsa, bizning storeId ichida bormi tekshiramiz
		return item.allowedStores.includes(storeId)
	})
}

export function AppSidebar({
	collapsed,
	onToggle,
}: {
	collapsed: boolean
	onToggle: () => void
}) {
	const { pathname } = useLocation()
	const { t } = useTranslation()
	const navItems = useNavItems()

	return (
		<aside
			className={cn(
				'hidden md:flex sticky overflow-y-auto top-0 left-0 border-r ',
				collapsed ? 'w-[52px]' : 'w-[270px]',
			)}
		>
			<div className='flex w-full flex-col'>
				<div className={`flex items-center h-16 ${!collapsed && 'px-4 gap-2'}`}>
					<div className='flex items-center gap-3 justify-center'>
						{!collapsed && (
							<Link
								to={'/dashboard'}
								className='text-start font-bold text-[#6A81FF] flex items-center gap-2'
							>
								<img src={imagelogo} alt='logoimage' className='w-[50px]' />
								<span className='text-2xl font-bold'>adukon</span>
							</Link>
						)}
					</div>
					<button
						onClick={onToggle}
						aria-label='Toggle sidebar'
						className={`${collapsed ? 'bg-gradient-to-tr from-[#6A81FF] to-[#2E4EFE] mx-auto text-white ' : 'text-neutral-500  hover:shadow-xl ml-auto'}  cursor-pointer flex justify-center items-center rounded-[4px] border w-6 h-6`}
					>
						{collapsed ? (
							<ChevronRight
								size={55}
								strokeWidth={3}
								className='font-bold w-4 h-4'
							/>
						) : (
							<ChevronLeft
								size={25}
								strokeWidth={3}
								className='font-bold w-4 h-4'
							/>
						)}
					</button>
				</div>
				<ScrollArea className='flex-1'>
					<nav className='pr-2 py-3 space-y-2 overflow-y-auto'>
						{navItems.map(n => {
							const active =
								n.href === '/dashboard'
									? pathname === n.href
									: pathname.startsWith(n.href)

							return (
								<div className={`flex items-center gap-2 w-full`} key={n.href}>
									{!collapsed && (
										<span
											className={`w-[4px] h-[44px] block rounded-2xl  ${
												active ? 'bg-[#6A81FF]' : ''
											}`}
										></span>
									)}
									<NavLink
										key={n.href}
										to={n.href}
										className={`flex mx-auto text-[15px]  items-center gap-x-2 h-[44px] ${
											collapsed
												? 'justify-center w-11 h-11 ml-1'
												: 'w-full pl-4'
										}  ${
											active
												? 'bg-[#6A81FF33] text-[#6A81FF] font-medium'
												: 'font-medium'
										} p-[10px] rounded-[8px] hover:bg-[#6A81FF33] text-[#666A7F] dark:text-[#e3dbdb]`}
									>
										{!collapsed ? (
											<n.icon
												className={`w-5 h-5 ${active ? 'text-[#6A81FF]' : 'text-[#666A7F] dark:text-[#e3dbdb]'}`}
											/>
										) : (
											<CustomTooltip tooltipText={t(n.labelKey)}>
												<n.icon
													className={`${active ? 'text-[#6A81FF]' : 'text-[#666A7F] dark:text-[#e3dbdb]'}`}
												/>
											</CustomTooltip>
										)}
										{!collapsed && (
											<div className='flex-1 flex flex-row items-center justify-between'>
												<span className={active ? 'text-[#6A81FF]' : ''}>
													{t(n.labelKey)}
												</span>
											</div>
										)}
									</NavLink>
								</div>
							)
						})}
					</nav>
				</ScrollArea>
			</div>
		</aside>
	)
}

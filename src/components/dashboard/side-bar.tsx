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
	isNew?: boolean
}
function useNavItems(): NavItem[] {
	const storeId = localStorage.getItem('storeId') || ''

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

	return allNavItems.filter(item => {
		if (!item.allowedStores) return true

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
				collapsed ? 'w-[52px]' : 'w-[275px]',
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
									{/* Active chizig'i */}
									{!collapsed && (
										<span
											className={`w-[4px] h-[44px] block rounded-2xl  ${
												active ? 'bg-[#6A81FF]' : ''
											}`}
										></span>
									)}

									<NavLink
										to={n.href}
										className={`flex mx-auto text-[15px] items-center gap-x-2 h-[44px] relative ${
											// relative qo'shildi
											collapsed
												? 'justify-center w-11 h-11 ml-1'
												: 'w-full pl-4'
										}  ${
											active
												? 'bg-[#6A81FF33] text-[#6A81FF] font-medium'
												: 'font-medium'
										} p-[10px] rounded-[8px] hover:bg-[#6A81FF33] text-[#666A7F] dark:text-[#e3dbdb] group`} // group classi qo'shildi hover effekt uchun
									>
										{/* --- ICON QISMI --- */}
										{!collapsed ? (
											<n.icon
												className={`w-5 h-5 ${active ? 'text-[#6A81FF]' : 'text-[#666A7F] dark:text-[#e3dbdb]'}`}
											/>
										) : (
											<CustomTooltip tooltipText={t(n.labelKey)}>
												<div className='relative'>
													<n.icon
														className={`${active ? 'text-[#6A81FF]' : 'text-[#666A7F] dark:text-[#e3dbdb]'}`}
													/>
													{/* Yopiq holatdagi indikator (nuqta) */}
													{n.isNew && (
														<span className='absolute -top-1 -right-1 flex h-2.5 w-2.5'>
															<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
															<span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500'></span>
														</span>
													)}
												</div>
											</CustomTooltip>
										)}

										{/* --- TEXT VA BADGE QISMI (Ochiq holatda) --- */}
										{!collapsed && (
											<div className='flex-1 flex flex-row items-center justify-between pr-2'>
												<span className={active ? 'text-[#6A81FF]' : ''}>
													{t(n.labelKey)}
												</span>

												{/* Yangi Badge qismi */}
												{n.isNew && (
													<span className='bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 shadow-sm'>
														NEW
													</span>
												)}
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

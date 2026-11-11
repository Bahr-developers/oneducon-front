import {
	BadgeDollarSign,
	BadgePlus,
	BellRing,
	Combine,
	Expand,
	House,
	Kanban,
	PackagePlus,
	PackageSearch,
	PanelLeftClose,
	PanelLeftOpen,
	Users,
	type LucideIcon,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/images/logo.png'
import { cn } from '@/lib/utils'
import { Profile } from '../menu/profile'

const navItems = [
	{ labelKey: 'Asosiy panel', href: '/dashboard', icon: House },
	{ labelKey: 'Buyurtma berish', href: '/dashboard/orders', icon: BadgePlus },
	{ labelKey: 'Sotuvlar', href: '/dashboard/selers', icon: BadgeDollarSign },
	{ labelKey: 'Xarajatlar', href: '/dashboard/expenses', icon: Expand },
	{ labelKey: 'Qarzlar', href: '/dashboard/debts', icon: Kanban },
	{ labelKey: 'Mahsulotlar', href: '/dashboard/products', icon: PackageSearch },
	{ labelKey: 'Mahsulot kirimi', href: '/dashboard/imports', icon: PackagePlus },
	{ labelKey: 'Mijozlar', href: '/dashboard/customers', icon: Users },
	{ labelKey: 'Birliklar', href: '/dashboard/units', icon: Combine },
]

function SidebarLink({
	label,
	href,
	icon: Icon,
	collapsed,
	onNavigate,
}: {
	label: string
	href: string
	icon: LucideIcon
	collapsed: boolean
	onNavigate?: () => void
}) {
	return (
		<NavLink
			to={href}
			end={href === '/dashboard'}
			onClick={onNavigate}
			aria-label={collapsed ? label : undefined}
			title={collapsed ? label : undefined}
			className={({ isActive }) =>
				cn(
					'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
					collapsed && 'justify-center px-0',
					isActive && 'bg-[#536BE8]/12 text-[#4056C8] hover:bg-[#536BE8]/16 dark:text-[#A6B2FF]',
				)
			}
		>
			<Icon className='size-[18px] shrink-0' aria-hidden='true' />
			{!collapsed && <span>{label}</span>}
		</NavLink>
	)
}

export function AppSidebar({
	collapsed,
	onToggle,
	mobile = false,
	onNavigate,
}: {
	collapsed: boolean
	onToggle?: () => void
	mobile?: boolean
	onNavigate?: () => void
}) {
	const { t } = useTranslation()

	return (
		<aside
			className={cn(
				'min-h-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground',
				mobile ? 'flex h-full w-full' : 'hidden border-r border-sidebar-border md:flex',
				!mobile && (collapsed ? 'w-15' : 'w-[260px]'),
			)}
		>
			<div
				className={cn(
					'flex h-16 shrink-0 items-center gap-2 px-3',
					collapsed && 'justify-center px-2',
					mobile && 'pr-12',
				)}
			>
				{!collapsed && (
					<Link
						to='/dashboard'
						onClick={onNavigate}
						className='flex flex-1 items-center gap-1.5 rounded-md text-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring'
					>
						<img src={logo} alt='' className='w-9' />
						adukon
					</Link>
				)}
				{!mobile && (
					<button
						type='button'
						onClick={onToggle}
						aria-label={collapsed ? 'Yon menyuni kengaytirish' : 'Yon menyuni yig‘ish'}
						aria-expanded={!collapsed}
						className='grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-foreground outline-none hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-ring'
					>
						{collapsed ? <PanelLeftOpen className='size-4' /> : <PanelLeftClose className='size-4' />}
					</button>
				)}
			</div>

			<nav aria-label='Asosiy menyu' className='min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-2'>
				{navItems.map(item => (
					<SidebarLink
						key={item.href}
						label={t(item.labelKey)}
						href={item.href}
						icon={item.icon}
						collapsed={collapsed}
						onNavigate={onNavigate}
					/>
				))}
			</nav>

			<div className='shrink-0 space-y-1 border-t border-sidebar-border p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]'>
				<SidebarLink
					label={t('Kam qolgan mahsulotlar')}
					href='/dashboard/low-products'
					icon={BellRing}
					collapsed={collapsed}
					onNavigate={onNavigate}
				/>
				<Profile
					placement={collapsed ? 'collapsed-sidebar' : 'sidebar'}
					onNavigate={onNavigate}
				/>
			</div>
		</aside>
	)
}

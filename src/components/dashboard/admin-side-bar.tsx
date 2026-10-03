import { cn } from '@/lib/utils'
import {
    BadgePlus,
    ChevronLeft,
    ChevronRight,
    LucideIcon, UserIcon,
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
function useAdminNavItems(): NavItem[] {
    const storeId = localStorage.getItem('storeId') || ''

    const allNavItems: NavItem[] = [
        {
            labelKey: 'Foydalanuvchilar',
            href: '/users',
            icon: UserIcon,
        },
        {
            labelKey: 'Dokonlar',
            href: '/stores',
            icon: BadgePlus,
        }
    ]

    return allNavItems.filter(item => {
        if (!item.allowedStores) return true

        return item.allowedStores.includes(storeId)
    })
}

export function AdminSidebar({
                               collapsed,
                               onToggle,
                               mobile = false,
                               onNavigate,
                           }: {
    collapsed: boolean
    onToggle: () => void
    mobile?: boolean
    onNavigate?: () => void
}) {
    const { pathname } = useLocation()
    const { t } = useTranslation()
    const navItems = useAdminNavItems()

    return (
        <aside
            className={cn(
                'sticky top-0 left-0 overflow-y-auto border-r bg-background',
                mobile
                    ? 'flex h-full w-full'
                    : 'hidden md:flex',
                !mobile && (collapsed ? 'w-[52px]' : 'w-[275px]'),
            )}
        >
            <div className='flex w-full flex-col'>
                <div className={`flex items-center h-16 ${!collapsed && 'px-4 gap-2'}`}>
                    <div className='flex items-center gap-3 justify-center'>
                        {!collapsed && (
                            <Link
                                to={'/dashboard'}
                                onClick={onNavigate}
                                className='text-start font-bold text-[#6A81FF] flex items-center gap-2'
                            >
                                <img src={imagelogo} alt='logoimage' className='w-[50px]' />
                                <span className='text-2xl font-bold'>adukon</span>
                            </Link>
                        )}
                    </div>
                    {!mobile && (
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
                    )}
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
                                        to={n.href}
                                        onClick={onNavigate}
                                        className={`flex mx-auto text-[15px] items-center gap-x-2 h-[44px] relative ${
                                            collapsed
                                                ? 'justify-center w-11 h-11 ml-1'
                                                : 'w-full pl-4'
                                        }  ${
                                            active
                                                ? 'bg-[#6A81FF33] text-[#6A81FF] font-medium'
                                                : 'font-medium'
                                        } p-[10px] rounded-[8px] hover:bg-[#6A81FF33] text-[#666A7F] dark:text-[#e3dbdb] group`}
                                    >
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
                                                    {n.isNew && (
                                                        <span className='absolute -top-1 -right-1 flex h-2.5 w-2.5'>
															<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
															<span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500'></span>
														</span>
                                                    )}
                                                </div>
                                            </CustomTooltip>
                                        )}
                                        {!collapsed && (
                                            <div className='flex-1 flex flex-row items-center justify-between pr-2'>
												<span className={active ? 'text-[#6A81FF]' : ''}>
													{t(n.labelKey)}
												</span>
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

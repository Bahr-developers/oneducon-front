import { ChevronsUpDown, LogOut, Settings, UserRound } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import AvatarImg from '@/assets/svg/user.svg'
import { cn } from '@/lib/utils'
import { logout } from '@/store/auth-slice'
import { useAppDispatch } from '@/store/hooks'

const profilePath = '/dashboard/profile'

export function Profile({
	placement = 'header',
	onNavigate,
}: {
	placement?: 'header' | 'sidebar' | 'collapsed-sidebar'
	onNavigate?: () => void
}) {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const queryClient = useQueryClient()
	const profileActive = !!useMatch(profilePath)
	const inSidebar = placement !== 'header'
	const collapsed = placement === 'collapsed-sidebar'

	const handleLogout = () => {
		onNavigate?.()
		dispatch(logout())
		queryClient.clear()
		navigate('/', { replace: true })
	}

	return (
		<DropdownMenu modal={!inSidebar}>
			<DropdownMenuTrigger
				aria-label='Profil menyusi'
				title={collapsed ? 'Profil' : undefined}
				className={cn(
					'cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring',
					inSidebar &&
						'flex min-h-11 w-full items-center gap-2.5 px-2.5 text-left text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent',
					collapsed && 'justify-center px-0',
					inSidebar && profileActive && 'bg-sidebar-accent',
				)}
			>
				{inSidebar ? (
					<>
						<span className='flex size-8 shrink-0 items-center justify-center rounded-md bg-[#536BE8]/12 text-[#4056C8] dark:text-[#A6B2FF]'>
							<UserRound className='size-4' aria-hidden='true' />
						</span>
						{!collapsed && (
							<>
								<span className='flex-1'>Profil</span>
								<ChevronsUpDown className='size-4 text-muted-foreground' aria-hidden='true' />
							</>
						)}
					</>
				) : (
					<Avatar className='bg-[#F4F4F4]'>
						<AvatarImage src={AvatarImg} alt='' />
					</Avatar>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side={collapsed ? 'right' : inSidebar ? 'top' : 'bottom'}
				align={placement === 'sidebar' ? 'start' : 'end'}
				sideOffset={8}
				collisionPadding={8}
				className='w-52 motion-reduce:animate-none'
			>
				<DropdownMenuItem asChild>
					<Link to={profilePath} onClick={onNavigate}>
						<UserRound aria-hidden='true' />
						Profil
					</Link>
				</DropdownMenuItem>
				{inSidebar && (
					<DropdownMenuItem asChild>
						<Link to={`${profilePath}?activeTab=settings`} onClick={onNavigate}>
							<Settings aria-hidden='true' />
							Sozlamalar
						</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem variant='destructive' onSelect={handleLogout}>
					<LogOut aria-hidden='true' />
					Chiqish
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

import Loader from '@/components/_components/loader'
import { AppSidebar } from '@/components/dashboard/side-bar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false)
		}, 500)

		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		if (!mobileOpen) return

		const desktop = window.matchMedia('(min-width: 48rem)')
		const closeOnDesktop = (event: MediaQueryListEvent) => {
			if (event.matches) setMobileOpen(false)
		}
		desktop.addEventListener('change', closeOnDesktop)
		return () => desktop.removeEventListener('change', closeOnDesktop)
	}, [mobileOpen])

	if (loading) {
		return <Loader />
	}
	return (
		<div className='flex h-dvh w-full flex-col md:flex-row'>
			<div className='shrink-0 border-b bg-background px-4 py-2 md:hidden'>
				<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
					<SheetTrigger asChild>
						<Button type='button' variant='ghost' className='h-11 px-3'>
							<Menu className='size-5' aria-hidden='true' />
							Menyu
						</Button>
					</SheetTrigger>
					<SheetContent
						side='left'
						aria-describedby={undefined}
						className='h-dvh w-72 max-w-[calc(100%-2rem)] p-0 motion-reduce:animate-none'
					>
						<SheetTitle className='sr-only'>Yon menyu</SheetTitle>
						<AppSidebar collapsed={false} mobile onNavigate={() => setMobileOpen(false)} />
					</SheetContent>
				</Sheet>
			</div>
			<AppSidebar
				collapsed={collapsed}
				onToggle={() => setCollapsed(v => !v)}
			/>
			<div className='relative min-h-0 min-w-0 flex-1 overflow-y-auto p-4 pt-7'>
				<Outlet />
			</div>
		</div>
	)
}

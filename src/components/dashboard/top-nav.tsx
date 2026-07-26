import { useState } from 'react'
import { BellRing, Menu } from 'lucide-react'
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet'
import { AppSidebar } from './side-bar'
import { Profile } from '../menu/profile'
import { ModeToggle } from '../menu/mode-toggle'
import { Link } from 'react-router-dom'

export function TopNav() {
	const [open, setOpen] = useState(false)

	return (
		<header className='h-16 sticky rounded-[8px] top-0 z-40 bg-background/50 backdrop-blur-md'>
			<div className='flex items-center justify-between gap-3 h-full px-4'>
				<div className='md:hidden'>
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<button
								type='button'
								aria-label='Menyuni ochish'
								className='inline-flex size-10 items-center justify-center rounded-lg border bg-card text-foreground shadow-sm'
							>
								<Menu className='size-5' />
							</button>
						</SheetTrigger>
						<SheetContent
							side='left'
							className='w-[280px] p-0 sm:max-w-[280px]'
						>
							<SheetTitle className='sr-only'>Navigatsiya</SheetTitle>
							<AppSidebar
								collapsed={false}
								onToggle={() => {}}
								mobile
								onNavigate={() => setOpen(false)}
							/>
						</SheetContent>
					</Sheet>
				</div>

				<div className='flex items-center justify-between gap-x-4 ml-auto'>
					<ModeToggle />
					<Link to={'/dashboard/low-products'}>
						<BellRing />
					</Link>
					<Profile />
				</div>
			</div>
			<hr />
		</header>
	)
}

import { useRouteError, useNavigate } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button' // shadcn button yo'lini to'g'rilang
interface RouteError {
	status?: number
	statusText?: string
	message?: string
}

const ErrorPage = () => {
	const error = useRouteError() as RouteError
	const navigate = useNavigate()

	console.error('ErrorPage da ushlangan xatolik:', error)

	const errorMessage = error?.message || error?.statusText || "Noma'lum xatolik"
	const isChunkError =
		errorMessage.includes('dynamically imported module') ||
		errorMessage.includes('Importing a module script failed')

	const handleReload = () => {
		window.location.reload()
	}

	return (
		<div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-background text-foreground p-6 font-['Poppins']">
			<div className='max-w-md w-full text-center space-y-6'>
				<div className='relative flex items-center justify-center w-24 h-24 mx-auto bg-muted rounded-full ring-4 ring-muted/50 animate-in zoom-in duration-300'>
					{isChunkError ? (
						<RefreshCw className='w-10 h-10 text-primary animate-spin-slow' />
					) : (
						<AlertTriangle className='w-10 h-10 text-destructive' />
					)}
				</div>

				<div className='space-y-2'>
					<h1 className='text-3xl font-semibold tracking-tight text-foreground'>
						{isChunkError ? 'Yangi versiya mavjud!' : 'Xatolik yuz berdi'}
					</h1>
					<p className='text-muted-foreground text-sm md:text-base leading-relaxed'>
						{isChunkError
							? "Ilova yangilandi. Eng so'nggi o'zgarishlarni ko'rish uchun sahifani yangilang."
							: errorMessage === 'Not Found'
								? 'Siz qidirayotgan sahifa topilmadi.'
								: "Kutilmagan xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring!"}
					</p>
				</div>

				{/* Tugmalar qismi */}
				<div className='flex flex-col sm:flex-row gap-3 justify-center pt-4'>
					<Button
						size='lg'
						onClick={handleReload}
						className='w-full sm:w-auto font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all'
					>
						<RefreshCw className='mr-2 h-4 w-4' />
						Sahifani yangilash
					</Button>

					{!isChunkError && (
						<Button
							variant='outline'
							size='lg'
							onClick={() => navigate('/')}
							className='w-full sm:w-auto border-border hover:bg-muted'
						>
							<Home className='mr-2 h-4 w-4' />
							Bosh sahifa
						</Button>
					)}
				</div>

				{/* Texnik xabar (Faqat developerlar uchun yoki "Not Chunk Error" bo'lsa) */}
				{!isChunkError && error?.message && (
					<div className='mt-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-left'>
						<p className='text-xs font-mono text-destructive break-all'>
							Code: {errorMessage}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default ErrorPage

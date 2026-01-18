import { Link, useNavigate } from 'react-router-dom'
import Logo from '@/assets/images/logo.png'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { authUtils } from '@/utils/auth'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)

	const auth = useMutation({
		mutationFn: authUtils.authStore,
		onSuccess: () => {
			toast.success('Muvaffaqiyatli kirildi ✅')
			setTimeout(() => {
				navigate('/dashboard')
			}, 1000)
		},
		onError: err => {
			console.log(err)
			toast.error('Login yoki parolda xatolik ❌ ')
		},
	})

	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		try {
			auth.mutate({
				email: form.login.value,
				password: form.password.value,
			})
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<section className='h-screen'>
			<div className='flex flex-col items-center justify-center px-6 py-5 mx-auto md:h-[85vh] lg:py-0'>
				<Link
					to='/'
					className='flex items-center mb-6  gap-x-4 font-semibold text-gray-900 dark:text-white'
				>
					<img className='w-[70px]' src={Logo} alt='logo' />
					<span className='text-4xl font-bold'>adukon</span>
				</Link>
				<div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
					<div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
						<h1 className='text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
							Boshqaruv paneliga kirish
						</h1>
						<form
							className='space-y-4 md:space-y-6'
							action='#'
							onSubmit={handleLogin}
						>
							<div>
								<label
									htmlFor='login'
									className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
								>
									Email
								</label>
								<input
									autoFocus
									type='text'
									name='login'
									id='login'
									className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
									placeholder='Login'
									required
								/>
							</div>

							{/* Password Input */}
							<div>
								<label
									htmlFor='password'
									className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
								>
									Parol
								</label>
								<div className='relative'>
									<input
										autoComplete='current-password'
										type={showPassword ? 'text' : 'password'}
										name='password'
										id='password'
										placeholder='*********'
										className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
										required
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300'
									>
										{showPassword ? (
											<EyeOff className='h-5 w-5' />
										) : (
											<Eye className='h-5 w-5' />
										)}
									</button>
								</div>
							</div>

							<button
								type='submit'
								className='w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-[18px] cursor-pointer'
							>
								Kirish
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Login

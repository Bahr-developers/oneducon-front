import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
	Store,
	User,
	Lock,
	DollarSign,
	Link as LinkIcon,
	Save,
	Loader2,
	Eye,
	EyeOff,
	CheckCircle2,
	AlertCircle,
} from 'lucide-react'
import NumberInput from '@/components/_components/number-input'
import { storeUtils } from '@/utils/store'
import toast from 'react-hot-toast'
import { useQueryParams } from '@/hooks/query-params'

const StoreProfile = () => {
	const queryClient = useQueryClient()
	const storeId = localStorage.getItem('storeId') || ''

	const { updateURL, getParam } = useQueryParams()

	// Form states
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [usdRate, setUsdRate] = useState(0)
	const [link, setLink] = useState('')

	// UI states
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const [activeTab, setActiveTab] = useState<string>(() =>
		getParam('activeTab', 'general'),
	)

	useEffect(() => {
		updateURL({
			activeTab: activeTab,
		})
	}, [activeTab, updateURL])

	// Store ma'lumotlarini olish
	const { data: storeData, isLoading } = useQuery({
		queryKey: ['store', storeId],
		queryFn: () => storeUtils.getStoreByID(storeId),
		enabled: !!storeId,
	})

	// Ma'lumotlarni formga yuklash
	useEffect(() => {
		if (storeData) {
			setName(storeData?.data?.name || '')
			setEmail(storeData?.data?.email || '')
			setUsdRate(storeData?.data?.usd_rate || 0)
			setLink(storeData?.data?.link || '')
		}
	}, [storeData])

	// Umumiy ma'lumotlarni yangilash
	const updateGeneral = useMutation({
		mutationFn: storeUtils.patchStore,
		onSuccess: () => {
			toast.success('Profil muvaffaqiyatli yangilandi!')
			queryClient.invalidateQueries({ queryKey: ['store', storeId] })
		},
		onError: err => {
			const error = err as AxiosError<{ message: string }>
			toast.error(error.response?.data.message || 'Xatolik yuz berdi!')
			console.log(error)
		},
	})

	// Parolni yangilash
	const updatePassword = useMutation({
		mutationFn: storeUtils.patchStore,
		onSuccess: () => {
			toast.success("Parol muvaffaqiyatli o'zgartirildi!")
			queryClient.invalidateQueries({ queryKey: ['store', storeId] })
			setPassword('')
			setConfirmPassword('')
		},
		onError: err => {
			const error = err as AxiosError<{ message: string }>
			toast.error(
				error.response?.data.message || "Parol o'zgartirishda xatolik!",
			)
			console.log(error)
		},
	})

	// Sozlamalarni yangilash
	const updateSettings = useMutation({
		mutationFn: storeUtils.patchStore,
		onSuccess: () => {
			toast.success('Sozlamalar muvaffaqiyatli saqlandi!')
			queryClient.invalidateQueries({ queryKey: ['store', storeId] })
			localStorage.setItem('usd_rate', String(usdRate))
		},
		onError: err => {
			const error = err as AxiosError<{ message: string }>
			toast.error(
				error.response?.data.message || 'Sozlamalarni saqlashda xatolik!',
			)
			console.log(error)
		},
	})

	// Validation
	const isGeneralValid = name?.trim().length > 2 && email?.includes('@')
	const isPasswordValid = password.length >= 6 && password === confirmPassword
	const isSettingsValid = usdRate > 0

	// Umumiy ma'lumotlarni yangilash
	const handleUpdateGeneral = () => {
		if (!isGeneralValid) {
			toast.error("Iltimos, barcha maydonlarni to'g'ri to'ldiring!")
			return
		}

		updateGeneral.mutate({
			id: storeId,
			name,
			email,
			password: storeData?.data?.password || '',
			user_id: storeData?.data?.user_id || 0,
			usd_rate: storeData?.data?.usd_rate,
			link: storeData?.data?.link,
		})
	}

	// Parolni yangilash
	const handleUpdatePassword = () => {
		if (password.length < 6) {
			toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak!")
			return
		}

		if (password !== confirmPassword) {
			toast.error('Parollar mos emas!')
			return
		}

		updatePassword.mutate({
			id: storeId,
			name: storeData?.data?.name || '',
			email: storeData?.data?.email || '',
			password,
			user_id: Number(storeData?.data?.user_id) || 0,
			usd_rate: storeData?.data?.usd_rate,
			link: storeData?.data?.link,
		})
	}

	// Sozlamalarni yangilash
	const handleUpdateSettings = () => {
		if (!isSettingsValid) {
			toast.error("USD kursi noto'g'ri!")
			return
		}

		updateSettings.mutate({
			id: storeId,
			name: storeData?.data?.name || '',
			email: storeData?.data?.email || '',
			password: storeData?.data?.password || '',
			user_id: Number(storeData?.data?.user_id) || 0,
			usd_rate: usdRate,
			link,
		})
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader2 className='w-8 h-8 animate-spin text-primary' />
			</div>
		)
	}

	if (!storeData) {
		return (
			<div className='flex flex-col items-center justify-center h-screen gap-4'>
				<AlertCircle className='w-16 h-16 text-red-500' />
				<p className='text-lg text-muted-foreground'>
					Do'kon ma'lumotlari topilmadi
				</p>
			</div>
		)
	}

	return (
		<div className='container max-w-4xl mx-auto p-6 space-y-6'>
			{/* Header */}
			<div className='flex items-center gap-4'>
				<Avatar className='w-20 h-20 border-4 border-primary/20'>
					<AvatarImage src='/store-logo.png' />
					<AvatarFallback className='text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold'>
						{name?.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className='flex-1'>
					<h1 className='text-3xl font-bold'>{name}</h1>
					<p className='text-muted-foreground'>{email}</p>
					<div className='flex gap-2 mt-2'>
						<Badge variant='secondary' className='gap-1'>
							<Store className='w-3 h-3' />
							Store ID: {storeId}
						</Badge>
						<Badge variant='outline' className='gap-1'>
							<User className='w-3 h-3' />
							User ID: {storeData.user_id}
						</Badge>
					</div>
				</div>
			</div>

			<Separator />

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='general' className='gap-2'>
						<User className='w-4 h-4' />
						Umumiy
					</TabsTrigger>
					<TabsTrigger value='security' className='gap-2'>
						<Lock className='w-4 h-4' />
						Xavfsizlik
					</TabsTrigger>
					<TabsTrigger value='settings' className='gap-2'>
						<DollarSign className='w-4 h-4' />
						Sozlamalar
					</TabsTrigger>
				</TabsList>

				{/* UMUMIY MA'LUMOTLAR */}
				<TabsContent value='general' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<User className='w-5 h-5' />
								Umumiy ma'lumotlar
							</CardTitle>
							<CardDescription>
								Do'kon nomi va email manzilingizni tahrirlang
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Do'kon nomi *</Label>
								<Input
									id='name'
									placeholder='Mega Store'
									value={name}
									onChange={e => setName(e.target.value)}
									className='h-12'
								/>
								{name?.length > 0 && name?.length < 3 && (
									<p className='text-sm text-red-500 flex items-center gap-1'>
										<AlertCircle className='w-4 h-4' />
										Nom kamida 3 ta belgidan iborat bo'lishi kerak
									</p>
								)}
								{name?.length >= 3 && (
									<p className='text-sm text-green-600 flex items-center gap-1'>
										<CheckCircle2 className='w-4 h-4' />
										To'g'ri formatda
									</p>
								)}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='email'>Email manzil *</Label>
								<Input
									id='email'
									type='email'
									placeholder='owner@megastore.uz'
									value={email}
									onChange={e => setEmail(e.target.value)}
									className='h-12'
								/>
								{email.length > 0 && !email.includes('@') && (
									<p className='text-sm text-red-500 flex items-center gap-1'>
										<AlertCircle className='w-4 h-4' />
										Noto'g'ri email format
									</p>
								)}
								{email.includes('@') && (
									<p className='text-sm text-green-600 flex items-center gap-1'>
										<CheckCircle2 className='w-4 h-4' />
										To'g'ri formatda
									</p>
								)}
							</div>

							<Button
								onClick={handleUpdateGeneral}
								disabled={!isGeneralValid || updateGeneral.isPending}
								className='w-full h-12'
								size='lg'
							>
								{updateGeneral.isPending ? (
									<>
										<Loader2 className='w-4 h-4 mr-2 animate-spin' />
										Saqlanmoqda...
									</>
								) : (
									<>
										<Save className='w-4 h-4 mr-2' />
										O'zgarishlarni saqlash
									</>
								)}
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				{/* XAVFSIZLIK */}
				<TabsContent value='security' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Lock className='w-5 h-5' />
								Parolni o'zgartirish
							</CardTitle>
							<CardDescription>
								Hisobingiz xavfsizligini ta'minlash uchun kuchli parol o'rnating
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='password'>Yangi parol *</Label>
								<div className='relative'>
									<Input
										id='password'
										type={showPassword ? 'text' : 'password'}
										placeholder='••••••••'
										value={password}
										onChange={e => setPassword(e.target.value)}
										className='h-12 pr-10'
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								{password.length > 0 && password.length < 6 && (
									<p className='text-sm text-red-500 flex items-center gap-1'>
										<AlertCircle className='w-4 h-4' />
										Parol kamida 6 ta belgidan iborat bo'lishi kerak
									</p>
								)}
								{password.length >= 6 && (
									<p className='text-sm text-green-600 flex items-center gap-1'>
										<CheckCircle2 className='w-4 h-4' />
										Kuchli parol
									</p>
								)}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='confirmPassword'>Parolni tasdiqlash *</Label>
								<div className='relative'>
									<Input
										id='confirmPassword'
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder='••••••••'
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
										className='h-12 pr-10'
									/>
									<button
										type='button'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
									>
										{showConfirmPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
								{confirmPassword.length > 0 && password !== confirmPassword && (
									<p className='text-sm text-red-500 flex items-center gap-1'>
										<AlertCircle className='w-4 h-4' />
										Parollar mos emas
									</p>
								)}
								{confirmPassword.length > 0 &&
									password === confirmPassword &&
									password.length >= 6 && (
										<p className='text-sm text-green-600 flex items-center gap-1'>
											<CheckCircle2 className='w-4 h-4' />
											Parollar mos keladi
										</p>
									)}
							</div>

							<div className='p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800'>
								<p className='text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2'>
									<AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
									<span>
										Parol o'zgartirilgandan so'ng, qayta tizimga kirishingiz
										kerak bo'lishi mumkin
									</span>
								</p>
							</div>

							<Button
								onClick={handleUpdatePassword}
								disabled={
									!password || !isPasswordValid || updatePassword.isPending
								}
								className='w-full h-12'
								variant='destructive'
								size='lg'
							>
								{updatePassword.isPending ? (
									<>
										<Loader2 className='w-4 h-4 mr-2 animate-spin' />
										O'zgartirilmoqda...
									</>
								) : (
									<>
										<Lock className='w-4 h-4 mr-2' />
										Parolni o'zgartirish
									</>
								)}
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				{/* SOZLAMALAR */}
				<TabsContent value='settings' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<DollarSign className='w-5 h-5' />
								Do'kon sozlamalari
							</CardTitle>
							<CardDescription>
								Valyuta kursi va web-sayt manzilini boshqaring
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='usdRate'>USD kursi (UZS) *</Label>
								<NumberInput
									value={usdRate}
									onChange={val => setUsdRate(val.raw)}
									placeholder='12500'
									className='w-full h-12'
								/>
								{usdRate > 0 && (
									<p className='text-sm text-green-600 flex items-center gap-1'>
										<CheckCircle2 className='w-4 h-4' />1 USD ={' '}
										{usdRate?.toLocaleString()} UZS
									</p>
								)}
								{usdRate === 0 && (
									<p className='text-sm text-red-500 flex items-center gap-1'>
										<AlertCircle className='w-4 h-4' />
										USD kursi kiritilishi shart
									</p>
								)}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='link'>Web-sayt manzili (ixtiyoriy)</Label>
								<div className='relative'>
									<Input
										id='link'
										type='url'
										placeholder='https://megastore.uz'
										value={link}
										onChange={e => setLink(e.target.value)}
										className='h-12 pl-10'
									/>
									<LinkIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
								</div>
							</div>

							<div className='p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2'>
								<p className='text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2'>
									<Store className='w-4 h-4' />
									Joriy sozlamalar:
								</p>
								<ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-6'>
									<li>
										• USD kursi:{' '}
										{storeData?.data?.usd_rate?.toLocaleString() || '0'} UZS
									</li>
									<li>• Web-sayt: {storeData?.data?.link || 'Kiritilmagan'}</li>
								</ul>
							</div>

							<Button
								onClick={handleUpdateSettings}
								disabled={!isSettingsValid || updateSettings.isPending}
								className='w-full h-12'
								size='lg'
							>
								{updateSettings.isPending ? (
									<>
										<Loader2 className='w-4 h-4 mr-2 animate-spin' />
										Saqlanmoqda...
									</>
								) : (
									<>
										<Save className='w-4 h-4 mr-2' />
										Sozlamalarni saqlash
									</>
								)}
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default StoreProfile

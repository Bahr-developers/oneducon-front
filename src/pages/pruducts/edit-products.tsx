import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { product, categoryType } from '@/@types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryUtils } from '@/utils/categories'
import { unitUtils } from '@/utils/units'
import { productUtils } from '@/utils/products'
import { AxiosError } from 'axios'
import NumberInput from '@/components/_components/number-input'
import { ProductBarcodeField } from './product-barcode-field'

interface EditProductProps {
	product: product
	showLabel?: boolean
	onSaved?: (changes: { id: string; name?: string; barcode?: string }) => void
}

function getFormData(product: product) {
	return {
		name: product.name,
		count: product.quantity ?? 0,
		remine_count: product.reminder_quantity ?? 0,
		tan_narx_uzb: product.cost_price,
		tan_narx_dol: product.cost_price_usd,
		saler_narxi: product.sale_price,
		saler_narxi_dol: product.sale_price_usd,
		usd_rate: product.usd_rate,
		unitId: product.unit?.id ?? '',
		categoryId: product.category?.id ?? '',
		barcode: product.barcode ?? '',
		wholesale_price: product.wholesale_price ?? product.cost_price,
	}
}

function getPatchValues(data: ReturnType<typeof getFormData>) {
	return {
		category_id: data.categoryId ? Number(data.categoryId) : null,
		unit_id: data.unitId ? Number(data.unitId) : null,
		name: data.name,
		quantity: data.count,
		reminder_quantity: data.remine_count,
		cost_price: Number(data.tan_narx_uzb),
		cost_price_usd: Number(data.tan_narx_dol),
		sale_price: Number(data.saler_narxi),
		sale_price_usd: Number(data.saler_narxi_dol),
		usd_rate: Number(data.usd_rate),
		barcode: data.barcode,
		wholesale_price: data.wholesale_price ? Number(data.wholesale_price) : null,
	}
}

const EditProduct = ({ product, showLabel = false, onSaved }: EditProductProps) => {
	const [open, setOpen] = useState(false)
	const [initialData, setInitialData] = useState(() => getFormData(product))
	const [data, setData] = useState(initialData)
	const [currentStock, setCurrentStock] = useState<number | null>(null)

	const queryClient = useQueryClient()

	const { data: categories } = useQuery({
		queryKey: ['get_all_categories'],
		queryFn: categoryUtils.getCategory,
	})

	const { data: units } = useQuery({
		queryKey: ['get_all_units'],
		queryFn: unitUtils.getUnit,
	})

	const editProduct = useMutation({
		mutationFn: productUtils.patchProduct,
		onSuccess: (data, changes) => {
			toast.success(data?.message)
			onSaved?.({ id: changes.id, name: changes.name, barcode: changes.barcode })
			queryClient.invalidateQueries({ queryKey: ['get_all_products'] })
			queryClient.invalidateQueries({ queryKey: ['product-details', product.id] })
			if (changes.quantity !== undefined) {
				queryClient.invalidateQueries({ queryKey: ['product-inventory-movements', product.id] })
				queryClient.invalidateQueries({ queryKey: ['imports-history'] })
			}
			setOpen(false)
		},
		onError: err => {
			const error = err as AxiosError<{
				code?: string
				current_quantity?: number
				message?: string | string[]
			}>
			const response = error.response?.data
			if (response?.code === 'STOCK_QUANTITY_CONFLICT' && typeof response.current_quantity === 'number') {
				setCurrentStock(response.current_quantity)
				queryClient.invalidateQueries({ queryKey: ['product-details', product.id] })
				queryClient.invalidateQueries({ queryKey: ['get_all_products'] })
				return
			}
			const message = response?.message
			toast.error((Array.isArray(message) ? message[0] : message) || 'Mahsulotni saqlab bo‘lmadi')
		},
	})

	const handleOpenChange = (nextOpen: boolean) => {
		if (editProduct.isPending) return
		if (nextOpen) {
			const initial = getFormData(product)
			setInitialData(initial)
			setData(initial)
			setCurrentStock(null)
		}
		setOpen(nextOpen)
	}

	const handleSubmit = () => {
		if (editProduct.isPending || currentStock !== null) return

		const previous = getPatchValues(initialData)
		const next = getPatchValues(data)
		const quantityChanged = !Object.is(next.quantity, previous.quantity)
		if (
			quantityChanged &&
			(!Number.isInteger(next.quantity) || next.quantity < -2_147_483_648 || next.quantity > 2_147_483_647)
		) {
			toast.error('Miqdorni butun son bilan kiriting')
			return
		}

		const changes = Object.fromEntries(
			Object.entries(next).filter(([key, value]) => !Object.is(value, previous[key as keyof typeof previous])),
		)
		if (Object.keys(changes).length === 0) {
			setOpen(false)
			return
		}

		editProduct.mutate({
			id: product.id,
			...changes,
			...(quantityChanged && { expected_quantity: previous.quantity }),
		})
	}

	const applyCurrentStock = () => {
		if (currentStock === null) return
		setInitialData(previous => ({ ...previous, count: currentStock }))
		setData(previous => ({ ...previous, count: currentStock }))
		setCurrentStock(null)
	}

	// Handle USD / UZS interlinked calculation
	const handleTanUzs = (value: number) => {
		setData(prev => ({
			...prev,
			tan_narx_uzb: value,
			tan_narx_dol:
				prev.usd_rate > 0
					? Math.round((value / prev?.usd_rate) * 100) / 100
					: 0,
		}))
	}

	const handleTanUsd = (value: number) => {
		setData(prev => ({
			...prev,
			tan_narx_dol: value,
			tan_narx_uzb: Math.round(value * prev?.usd_rate),
		}))
	}

	const handleSaleUzs = (value: number) => {
		setData(prev => ({
			...prev,
			saler_narxi: value,
			saler_narxi_dol:
				prev.usd_rate > 0
					? Math.round((value / prev?.usd_rate) * 100) / 100
					: 0,
		}))
	}

	const handleSaleUsd = (value: number) => {
		setData(prev => ({
			...prev,
			saler_narxi_dol: value,
			saler_narxi: Math.round(value * prev?.usd_rate),
		}))
	}

	const handleUsdRate = (value: number) => {
		setData(prev => ({
			...prev,
			usd_rate: value,
			tan_narx_uzb: Math.round(prev.tan_narx_dol * value),
			saler_narxi: Math.round(prev.saler_narxi_dol * value),
		}))
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant='outline' size={showLabel ? 'default' : 'icon'} aria-label={showLabel ? undefined : 'Mahsulotni tahrirlash'}>
					<Pencil /> {showLabel && 'Tahrirlash'}
				</Button>
			</DialogTrigger>

			<DialogContent w='md:w-[900px]'>
				<DialogHeader>
					<DialogTitle>Mahsulotni tahrirlash</DialogTitle>
					<DialogDescription className='sr-only'>Mahsulot ma’lumotlarini o‘zgartiring va saqlang.</DialogDescription>
					<div className='grid grid-cols-2 gap-4'>
						<label className='flex flex-col space-y-1'>
							<span>Nomi</span>
							<Input
								autoFocus
								value={data.name}
								name='name'
								placeholder='Mahsulot nomi'
								onChange={e => setData(prev => ({ ...prev, name: e.target.value }))}
								className='h-12'
							/>
						</label>

						<label className='flex flex-col space-y-1'>
							<span>Miqdori</span>
							<NumberInput
								value={data?.count}
								className='h-12'
								onChange={({ raw }) =>
									setData(prev => ({ ...prev, count: raw }))
								}
							/>
						</label>

						<label className='flex flex-col space-y-1'>
							<span>Eslatma miqdori</span>
							<NumberInput
								value={data?.remine_count}
								className='h-12'
								onChange={({ raw }) =>
									setData(prev => ({ ...prev, remine_count: raw }))
								}
							/>
						</label>
						<label className='flex flex-col space-y-1'>
							<span>USD kursi $</span>
							<NumberInput
								value={data?.usd_rate}
								onChange={({ raw }) => handleUsdRate(raw)}
								className='h-12'
							/>
						</label>

						<label className='flex flex-col space-y-1'>
							<span>Tan narxi (UZS)</span>
							<NumberInput
								className='h-12'
								value={data?.tan_narx_uzb}
								onChange={({ raw }) => handleTanUzs(raw)}
							/>
						</label>

						<label className='flex flex-col space-y-1'>
							<span>Tan narxi ($)</span>
							<NumberInput
								className='h-12'
								value={data?.tan_narx_dol}
								onChange={({ raw }) => handleTanUsd(raw)}
							/>
						</label>

						<label className='flex flex-col space-y-1'>
							<span>Sotuv narxi (UZS)</span>
							<NumberInput
								className='h-12'
								value={data?.saler_narxi}
								onChange={({ raw }) => handleSaleUzs(raw)}
							/>
						</label>

						<label className='flex flex-col space-y-1'>
							<span>Sotuv narxi ($)</span>
							<NumberInput
								value={data?.saler_narxi_dol}
								className='h-12'
								onChange={({ raw }) => handleSaleUsd(raw)}
							/>
						</label>

						<ProductBarcodeField
							value={data.barcode}
							onChange={barcode => setData(prev => ({ ...prev, barcode }))}
							generateWhenEmpty
						/>
						<label className='w-full flex col-span-1 flex-col space-y-2'>
							<span className='text-sm font-medium flex items-center gap-2'>
								Ulgurji narxi (UZS)
								<span className='text-red-500'>*</span>
							</span>
							<div className='relative'>
								<NumberInput
									value={data?.wholesale_price}
									className='h-12 pr-10'
									placeholder='Masalan: 5 000 000'
									onChange={({ raw }) => setData(prev => ({ ...prev, wholesale_price: raw }))}
								/>
							</div>
						</label>

						<label className='flex flex-col space-y-1'>
							<span>O‘lchov birligi</span>
							<Select
								defaultValue={data?.unitId ? String(data?.unitId) : undefined}
								onValueChange={val =>
									setData(prev => ({ ...prev, unitId: val }))
								}
							>
								<SelectTrigger className='h-12 w-full'>
									<SelectValue placeholder='Birlik tanlang...' />
								</SelectTrigger>
								<SelectContent>
									{units?.data?.map((el: categoryType) => (
										<SelectItem key={el.id} value={el.id}>
											{el.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</label>

						<label className='flex flex-col space-y-1'>
							<span>Kategoriya</span>
							<Select
								defaultValue={
									data?.categoryId ? String(data?.categoryId) : undefined
								}
								onValueChange={val =>
									setData(prev => ({ ...prev, categoryId: val }))
								}
							>
								<SelectTrigger className='h-12 w-full'>
									<SelectValue placeholder='Kategoriya tanlang...' />
								</SelectTrigger>
								<SelectContent>
									{categories?.data?.length &&
										categories?.data?.map((el: categoryType) => (
											<SelectItem key={el.id} value={el.id}>
												{el.name}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</label>
					</div>

					{currentStock !== null && (
						<div className='flex flex-wrap items-center gap-3 rounded-md border p-3'>
							<p role='alert' className='text-sm'>
								Ombordagi miqdor o‘zgardi. Hozirgi qoldiq {currentStock}.
							</p>
							<Button variant='outline' size='sm' onClick={applyCurrentStock}>
								Joriy miqdorni olish
							</Button>
						</div>
					)}
					<div className='flex justify-end gap-3 mt-3'>
						<Button onClick={handleSubmit} disabled={editProduct.isPending || currentStock !== null}>Saqlash</Button>
						<Button onClick={() => handleOpenChange(false)} disabled={editProduct.isPending}>Bekor qilish</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default EditProduct

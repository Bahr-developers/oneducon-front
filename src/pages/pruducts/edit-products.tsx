import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
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
import { product, categoryType } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryUtils } from '@/utils/categories'
import { unitUtils } from '@/utils/units'
import { productUtils } from '@/utils/products'
import { AxiosError } from 'axios'
import NumberInput from '@/components/_components/number-input'

interface EditProductProps {
	product: product
}

const EditProduct = ({ product }: EditProductProps) => {
	const [open, setOpen] = useState(false)
	const [barcode, setBarcode] = useState(product?.barcode || '')
	const [data, setData] = useState({
		name: product?.name,
		count: product?.quantity ?? 0,
		remine_count: product?.reminder_quantity ?? 0,
		tan_narx_uzb: product?.cost_price,
		tan_narx_dol: product?.cost_price_usd,
		saler_narxi: product?.sale_price,
		saler_narxi_dol: product?.sale_price_usd,
		usd_rate: product?.usd_rate,
		unitId: product?.unit?.id ?? '',
		categoryId: product?.category?.id ?? '',
	})

	console.log(data)
	console.log(product, product.name)

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
		onSuccess: data => {
			toast.success(data?.message)
			queryClient.invalidateQueries({ queryKey: ['get_all_products'] })
			setOpen(false)
		},
		onError: err => {
			const error = err as AxiosError<{ message: string }>
			toast.error(error.response?.data?.message || 'Something went wrong')
		},
	})

	// Handle form submit
	const handleSubmit = () => {
		editProduct.mutate({
			id: product.id,
			category_id: data.categoryId ? Number(data.categoryId) : null,
			unit_id: data.unitId ? Number(data.unitId) : null,
			name: String(data?.name),
			quantity: data?.count ? Number(data?.count) : 0,
			reminder_quantity: data?.remine_count ? Number(data?.remine_count) : 0,
			cost_price: Number(data?.tan_narx_uzb),
			cost_price_usd: Number(data?.tan_narx_dol),
			sale_price: Number(data?.saler_narxi),
			sale_price_usd: Number(data?.saler_narxi_dol),
			usd_rate: Number(data?.usd_rate),
			barcode,
		})
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setData(prev => ({
			...prev,
			[name]: value,
		}))
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className='flex items-center gap-x-2 cursor-pointer'>
				<Pencil size={20} />
			</DialogTrigger>

			<DialogContent w='md:w-[900px]'>
				<DialogHeader>
					<DialogTitle>Edit Product</DialogTitle>
					<div className='grid grid-cols-2 gap-4'>
						<label className='flex flex-col space-y-1'>
							<span>Nomi</span>
							<Input
								autoFocus
								defaultValue={data?.name}
								name='name'
								placeholder='Mahsulot nomi'
								onChange={handleChange}
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

						<label className='w-full flex col-span-2 flex-col space-y-2'>
							<span className='text-sm font-medium flex items-center gap-2'>
								Barcode
							</span>
							<div className='relative'>
								<Input
									type='text'
									step='0.01'
									className='h-12 pr-10'
									placeholder='Misol: 4780087820048'
									value={barcode}
									onChange={e => setBarcode(e.target.value)}
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

					<div className='flex justify-end gap-3 mt-3'>
						<Button onClick={handleSubmit}>Saqlash</Button>
						<Button onClick={() => setOpen(false)}>Bekor qilish</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default EditProduct

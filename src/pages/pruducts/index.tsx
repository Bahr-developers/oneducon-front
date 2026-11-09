import Productstable from './product-table'
import ProductCreate from './create-products'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productUtils } from '@/utils/products'
import toast from 'react-hot-toast'
import { ProductImportButton } from './product-import'
import { AxiosError } from 'axios'

const Products = () => {
	const queryClient = useQueryClient()
	const importFile = useMutation({
		mutationFn: async (formData: FormData) => {
			const result = await productUtils.postProductImport(formData)
			return result
		},
		onSuccess: response => {
			if (response.results.failed > 0) {
				toast.error(response.message)
			} else {
				toast.success(response.message)
			}
			queryClient.invalidateQueries({ queryKey: ['get_all_products'] })
			queryClient.invalidateQueries({ queryKey: ['product-details'] })
			queryClient.invalidateQueries({ queryKey: ['product-inventory-movements'] })
		},
		onError: err => {
			const error = err as AxiosError<{ message: string }>
			toast.error(error.response?.data.message || 'Hatolik mavjud')
		},
	})

	return (
		<div className='w-full'>
			<div className='flex justify-between items-center'>
				<h2 className='text-xl font-medium'>Mahsulotlar</h2>

				<div className='flex items-center gap-x-4'>
					<ProductCreate />
					<ProductImportButton
						loading={importFile.isPending}
						onUpload={file => {
							const formData = new FormData()
							formData.append('file', file)

							importFile.mutate(formData)
						}}
					/>
				</div>
			</div>
			<Productstable />
		</div>
	)
}

export default Products

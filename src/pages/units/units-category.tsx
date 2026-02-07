import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Ruler, Folder, PackageOpen } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryUtils } from '@/utils/categories'
import { categoryType } from '@/@types'
import { unitUtils } from '@/utils/units'
import toast from 'react-hot-toast'
import EditUnitCategory from './edit'
import { DeleteConfirm } from '@/components/ui/alerd-dialog'

// Interfeyslar
interface Category {
	id: string
	name: string
}

interface Unit {
	id: string
	name: string
}

// Skeleton Card komponenti
const ItemCardSkeleton = () => {
	return (
		<Card className='w-full max-w-sm'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<div className='flex items-center gap-2 flex-1'>
					<Skeleton className='h-4 w-4 rounded' />
					<Skeleton className='h-4 w-32' />
				</div>
				<div className='flex gap-2'>
					<Skeleton className='h-8 w-8 rounded' />
					<Skeleton className='h-8 w-8 rounded' />
				</div>
			</CardHeader>
			<CardContent>
				<Skeleton className='h-3 w-24' />
			</CardContent>
		</Card>
	)
}

// Grid Skeleton
const GridSkeleton = () => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
			{[...Array(6)].map((_, i) => (
				<ItemCardSkeleton key={i} />
			))}
		</div>
	)
}

// Umumiy Card komponenti
interface ItemCardProps {
	item: Category | Unit
	type: 'category' | 'unit'
}

const ItemCard: React.FC<ItemCardProps> = ({ item, type }) => {
	const queryClient = useQueryClient()

	const deleteItemCategory = useMutation({
		mutationFn: categoryUtils.deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['get_all_categories'] })
			toast.success("Kategoriya o'chirildi")
		},
		onError: () => {
			toast.error('Xatolik yuz berdi')
		},
	})

	const deleteItemUnits = useMutation({
		mutationFn: unitUtils.deleteUnit,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['get_all_units'] })
			toast.success("Birlik o'chirildi")
		},
		onError: () => {
			toast.error('Xatolik yuz berdi')
		},
	})

	return (
		<Card className='w-full max-w-sm hover:shadow-md transition-shadow duration-200 border-2'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium flex items-center gap-2'>
					{type === 'category' ? (
						<div className='p-2 rounded-lg bg-blue-100 dark:bg-blue-900'>
							<Folder className='h-4 w-4 text-blue-600 dark:text-blue-300' />
						</div>
					) : (
						<div className='p-2 rounded-lg bg-green-100 dark:bg-green-900'>
							<Ruler className='h-4 w-4 text-green-600 dark:text-green-300' />
						</div>
					)}
					<span className='capitalize'>{item.name}</span>
				</CardTitle>
				<div className='flex gap-2'>
					<EditUnitCategory item={item} type={type} />
					<DeleteConfirm
						onConfirm={
							type === 'category'
								? () => deleteItemCategory.mutate(item.id)
								: () => deleteItemUnits.mutate(item.id)
						}
					/>
				</div>
			</CardHeader>
			<CardContent>
				<div className='flex justify-between items-center'>
					<span className='text-xs text-muted-foreground font-mono'>
						ID: {item.id.slice(0, 8)}...
					</span>
					<span
						className={`text-xs px-2 py-1 rounded-full ${
							type === 'category'
								? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
								: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
						}`}
					>
						{type === 'category' ? 'Kategoriya' : 'Birlik'}
					</span>
				</div>
			</CardContent>
		</Card>
	)
}

// Empty State komponenti
interface EmptyStateProps {
	type: 'category' | 'unit'
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
	return (
		<div className='flex flex-col items-center justify-center py-16 px-4'>
			<div className='p-6 rounded-full bg-muted mb-4'>
				{type === 'category' ? (
					<Folder className='h-12 w-12 text-muted-foreground' />
				) : (
					<Ruler className='h-12 w-12 text-muted-foreground' />
				)}
			</div>
			<h3 className='text-lg font-semibold mb-2'>
				{type === 'category'
					? 'Kategoriyalar topilmadi'
					: 'Birliklar topilmadi'}
			</h3>
			<p className='text-sm text-muted-foreground text-center max-w-sm'>
				{type === 'category'
					? "Yuqoridagi tugmadan yangi kategoriya qo'shing"
					: "Yuqoridagi tugmadan yangi birlik qo'shing"}
			</p>
		</div>
	)
}

// Asosiy komponent
const CategoryUnitManager: React.FC = () => {
	const { data: categories, isLoading: categoriesLoading } = useQuery({
		queryKey: ['get_all_categories'],
		queryFn: categoryUtils.getCategory,
	})

	const { data: units, isLoading: unitsLoading } = useQuery({
		queryKey: ['get_all_units'],
		queryFn: unitUtils.getUnit,
	})

	return (
		<div className='container mx-auto p-6 space-y-6'>
			<div className='text-center space-y-2'>
				<div className='flex items-center justify-center gap-3 mb-2'>
					<div className='p-3 rounded-xl bg-primary/10'>
						<PackageOpen className='h-8 w-8 text-primary' />
					</div>
				</div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Kategoriya va Birliklar
				</h1>
				<p className='text-muted-foreground'>
					Barcha kategoriya va birliklarni boshqaring
				</p>
			</div>

			<Tabs defaultValue='categories' className='w-full'>
				<TabsList className='grid w-full grid-cols-2 h-12'>
					<TabsTrigger
						value='categories'
						className='flex items-center gap-2 text-base'
					>
						<Folder className='h-4 w-4' />
						Kategoriyalar
						{!categoriesLoading && (
							<span className='ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/20'>
								{categories?.data?.length || 0}
							</span>
						)}
					</TabsTrigger>
					<TabsTrigger
						value='units'
						className='flex items-center gap-2 text-base'
					>
						<Ruler className='h-4 w-4' />
						Birliklar
						{!unitsLoading && (
							<span className='ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/20'>
								{units?.data?.length || 0}
							</span>
						)}
					</TabsTrigger>
				</TabsList>

				<TabsContent value='categories' className='space-y-4 mt-6'>
					{categoriesLoading ? (
						<GridSkeleton />
					) : categories?.data?.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{categories.data.map((category: categoryType) => (
								<ItemCard key={category.id} item={category} type='category' />
							))}
						</div>
					) : (
						<EmptyState type='category' />
					)}
				</TabsContent>

				<TabsContent value='units' className='space-y-4 mt-6'>
					{unitsLoading ? (
						<GridSkeleton />
					) : units?.data?.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{units.data.map((unit: categoryType) => (
								<ItemCard key={unit.id} item={unit} type='unit' />
							))}
						</div>
					) : (
						<EmptyState type='unit' />
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default CategoryUnitManager

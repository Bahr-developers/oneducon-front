/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { debtsUtils } from '@/utils/debts'

import {
	Edit,
	Save,
	X,
	User,
	Phone,
	Calendar,
	Package,
	ShoppingCart,
	AlertCircle,
	Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

import OrderDetailsDialog from './view-debts'
import toast from 'react-hot-toast'
import PaymentAdd from './payment-add'

const DebtsPage = () => {
	const { id: userId } = useParams()
	const [editingDebt, setEditingDebt] = useState<string | null>(null)
	const [editedDebts, setEditedDebts] = useState<Record<string, any>>({})

	const queryClient = useQueryClient()
	const { id } = useParams()

	const { data: debtsClient, isLoading } = useQuery({
		queryKey: ['get_all_client_debts', userId],
		queryFn: () => debtsUtils.getDebtByClientId(userId as string),
		enabled: !!userId,
	})

	const debtsData = debtsClient?.data
	const clientData = debtsData?.client
	const debtsArray = debtsData?.debts ?? []

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat('uz-UZ').format(amount) + " so'm"

	const getStatusBadge = (status?: string) => {
		const config = {
			UNPAID: { variant: 'destructive', label: "To'lanmagan" },
			PAID: { variant: 'default', label: "To'langan" },
			PARTIAL: { variant: 'secondary', label: "Qisman to'langan" },
		}[status || 'UNPAID']

		return <Badge variant={config?.variant as any}>{config?.label}</Badge>
	}

	const updateDebts = useMutation({
		mutationFn: debtsUtils.editDebts,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['get_all_client_debts'] })
			toast.success('Qarz yangilandi ')
			setEditingDebt(null)
		},
		onError: err => {
			toast.error('Something went wrong!')
			console.log(err)
		},
	})

	const handleEdit = (debtId: string) => {
		setEditingDebt(debtId)

		const debt = debtsArray?.find((d: any) => d.id === debtId)
		if (debt) {
			setEditedDebts(prev => ({
				...prev,
				[debtId]: {
					price: debt.price,
					reminder: debt.reminder,
					status: debt.status,
					return_time: debt.return_time,
				},
			}))
		}
	}

	const handleSave = (debtId: string) => {
		const debt = editedDebts[debtId]

		updateDebts.mutate({
			client_id: Number(id),
			id: debtId,
			price: debt.price === 0 ? null : debt.price,
			reminder: debt.reminder,
			return_time: debt.return_time,
			status: debt.status,
		})
	}
	console.log(editedDebts, editedDebts?.data?.status)

	const handleCancel = (debtId: string) => {
		setEditingDebt(null)
		setEditedDebts(prev => {
			const newEdited = { ...prev }
			delete newEdited[debtId]
			return newEdited
		})
	}

	const handleChange = (debtId: string, field: string, value: any) => {
		setEditedDebts(prev => ({
			...prev,
			[debtId]: { ...prev[debtId], [field]: value },
		}))
	}
	const filteredDebts = debtsArray

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-80'>
				<Loader2 className='animate-spin h-10 w-10 text-blue-600' />
			</div>
		)
	}

	return (
		<div className='mx-auto p-6 space-y-4 w-full'>
			<h1 className='text-2xl font-bold'>Qarzlar Boshqaruvi</h1>
			{clientData && (
				<Card className='border-l-4 border-l-blue-500 shadow-sm'>
					<CardHeader className='bg-gradient-to-r  border-b'>
						<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
							<div className='flex items-center gap-4 justify-between w-full'>
								<div className='flex items-center gap-4'>
									<div className='p-2 bg-blue-100 rounded-lg'>
										<User className='h-6 w-6 text-blue-600' />
									</div>
									<div className=''>
										<CardTitle className='flex items-center gap-2 text-xl'>
											{clientData?.name}
											<Badge variant='outline' className='ml-2'>
												{filteredDebts?.length || 0} ta qarz
											</Badge>
										</CardTitle>
										<CardDescription className='flex items-center gap-2 mt-1'>
											<Phone className='h-4 w-4' />
											{clientData?.phone}
											<span className='text-gray-400'>•</span>
											<span>ID: {clientData?.id}</span>
										</CardDescription>
									</div>
								</div>
								<div className='text-right'>
									<div className='text-2xl font-bold text-red-600'>
										{formatCurrency(debtsData?.total_remaining_amount || 0)}
									</div>
									<div className='text-sm text-gray-600'>
										Umumiy qarz summasi
									</div>
								</div>
							</div>
							{/* <div className='text-right'>
								<div className='text-2xl font-bold text-red-600'>
									{formatCurrency(totalOverallDebt)}
								</div>
								<div className='text-sm text-gray-600'>Jami qarz summasi</div>
							</div> */}
						</div>
					</CardHeader>

					<CardContent className='p-0'>
						{/* Jadval */}
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Buyurtma №</TableHead>
										<TableHead>Buyurtma summasi</TableHead>
										<TableHead>Qarz miqdori</TableHead>
										<TableHead>To'langan miqdor</TableHead>
										<TableHead>Qolgan miqdor</TableHead>
										<TableHead>Eslatma</TableHead>
										<TableHead>Holati</TableHead>
										{/* <TableHead>Sana</TableHead> */}
										<TableHead>Harakatlar</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredDebts?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} className='text-center py-8'>
												<Package className='h-12 w-12 text-gray-400 mx-auto mb-4' />
												<h3 className='text-lg font-semibold text-gray-900'>
													Qarzlar topilmadi
												</h3>
												<p className='text-gray-600 mt-2'>
													Tanlangan filtrlarga mos keladigan qarzlar mavjud emas
												</p>
											</TableCell>
										</TableRow>
									) : (
										filteredDebts?.map((debt: any) => (
											<TableRow key={debt?.id}>
												<TableCell>
													<div className='flex items-center gap-2'>
														<ShoppingCart className='h-4 w-4 text-blue-600' />
														<span className='font-mono font-medium'>
															#{debt?.order?.order_number}
														</span>
													</div>
												</TableCell>
												<TableCell>
													{formatCurrency(debt?.order?.total_price || 0)}
												</TableCell>
												<TableCell>
													<span className='font-bold text-red-600'>
														{formatCurrency(debt?.price || 0)}
													</span>
												</TableCell>
												<TableCell className='text-green-700'>
													{formatCurrency(debt?.paid_amount || 0)}
												</TableCell>
												<TableCell className='text-amber-600'>
													{formatCurrency(debt?.remaining_amount || 0)}
												</TableCell>
												<TableCell>
													{editingDebt === debt?.id ? (
														<Textarea
															value={
																editedDebts[debt?.id]?.reminder ??
																debt?.reminder ??
																''
															}
															onChange={e =>
																handleChange(
																	debt?.id,
																	'reminder',
																	e.target.value,
																)
															}
														/>
													) : (
														<div>
															{debt?.reminder ? (
																<div className='flex items-start gap-2 max-w-32 '>
																	<AlertCircle className='h-4 w-4 text-yellow-500 mt-0.5' />
																	<span
																		className='text-sm line-clamp-2 w-full'
																		title={debt?.reminder}
																	>
																		{debt?.reminder}
																	</span>
																</div>
															) : (
																<span className='text-gray-400 text-sm italic'>
																	Eslatma yo'q...
																</span>
															)}
														</div>
													)}
												</TableCell>
												<TableCell>{getStatusBadge(debt?.status)}</TableCell>
												{/* <TableCell className='text-sm text-gray-600'>
													<Calendar className='h-4 w-4 inline mr-1' />
													{debt?.return_time?.slice(0, 10)}
												</TableCell> */}
												<TableCell>
													<div className='flex items-center gap-2'>
														{editingDebt === debt?.id ? (
															<>
																<Button
																	size='sm'
																	onClick={() => handleSave(debt?.id)}
																	className='h-8 bg-green-600 hover:bg-green-700'
																>
																	<Save className='h-4 w-4' />
																</Button>
																<Button
																	size='sm'
																	variant='outline'
																	onClick={() => handleCancel(debt?.id)}
																>
																	<X className='h-4 w-4' />
																</Button>
															</>
														) : (
															<>
																<Button
																	size='sm'
																	variant='outline'
																	onClick={() => handleEdit(debt?.id)}
																>
																	<Edit className='h-4 w-4' />
																</Button>
																<OrderDetailsDialog
																	debt={debt}
																	formatCurrency={formatCurrency}
																/>
																{debt?.status !== 'PAID' && (
																	<PaymentAdd debt={debt} />
																)}
															</>
														)}
													</div>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default DebtsPage

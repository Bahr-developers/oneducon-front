'use client'

import { useMemo, useRef } from 'react'
import { toPng } from 'html-to-image'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Printer } from 'lucide-react'

export interface ReceiptItem {
	product_id: number
	count: number
	discount: number
	price: number
	name?: string
}

export interface ReceiptPayment {
	payment_type_id: number
	price: number
	name?: string
}

export interface ReceiptDebt {
	price: number
	return_time: string
	reminder?: string
	client_id: number
}

export interface ReceiptClient {
	id: number
	name?: string
	phone?: string
}

export interface ReceiptStore {
	id: number
	name?: string
	address?: string
	phone?: string
}

export interface ReceiptOrder {
	id?: number | string
	created_at?: string
	store_id: number
	client_id?: number | null
	items: ReceiptItem[]
	payments: ReceiptPayment[]
	debts?: ReceiptDebt[]
}

interface ReceiptPreviewModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	order: ReceiptOrder | null
	store?: ReceiptStore | null
	client?: ReceiptClient | null
	productMap?: Record<number, string>
	paymentTypeMap?: Record<number, string>
	companyName?: string
	footerText?: string
}

const formatMoney = (value: number) =>
	Number(value || 0).toLocaleString('uz-UZ')

const formatDateTime = (date?: string) => {
	if (!date) return new Date().toLocaleString('uz-UZ')
	return new Date(date).toLocaleString('uz-UZ')
}

const formatShortDate = (date?: string) => {
	if (!date) return ''
	return new Date(date).toLocaleDateString('uz-UZ')
}

const ReceiptPreviewModal = ({
	open,
	onOpenChange,
	order,
	store,
	client,
	productMap = {},
	paymentTypeMap = {},
	companyName = 'Do‘kon nomi',
	footerText = 'Xaridingiz uchun rahmat!',
}: ReceiptPreviewModalProps) => {
	const receiptRef = useRef<HTMLDivElement | null>(null)

	if (!order) return null

	const items = order.items ?? []
	const payments = order.payments ?? []
	const debts = order.debts ?? []

	const hasDebt = debts.length > 0
	const shouldShowClient = Boolean(order.client_id || hasDebt)

	const subtotal = useMemo(() => {
		return items.reduce((acc, item) => acc + item.price * item.count, 0)
	}, [items])

	const totalDiscount = useMemo(() => {
		return items.reduce((acc, item) => acc + item.discount * item.count, 0)
	}, [items])

	const grandTotal = useMemo(() => {
		return items.reduce(
			(acc, item) => acc + (item.price - item.discount) * item.count,
			0,
		)
	}, [items])

	const paidTotal = useMemo(() => {
		return payments.reduce((acc, payment) => acc + payment.price, 0)
	}, [payments])

	const debtTotal = useMemo(() => {
		return debts.reduce((acc, debt) => acc + debt.price, 0)
	}, [debts])

	const handleDownloadImage = async () => {
		if (!receiptRef.current) return

		try {
			const dataUrl = await toPng(receiptRef.current, {
				cacheBust: true,
				pixelRatio: 2,
				backgroundColor: '#ffffff',
			})

			const link = document.createElement('a')
			link.download = `receipt-${order.id ?? Date.now()}.png`
			link.href = dataUrl
			link.click()
		} catch (error) {
			console.error('Rasm yuklab olishda xatolik:', error)
		}
	}

	const handlePrint = () => {
		if (!receiptRef.current) return

		const printContents = receiptRef.current.innerHTML
		const printWindow = window.open('', '_blank', 'width=420,height=900')

		if (!printWindow) return

		printWindow.document.write(`
		<!DOCTYPE html>
		<html lang="uz">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Check</title>
				<style>
					@page {
						size: 80mm auto;
						margin: 0;
					}

					* {
						box-sizing: border-box;
					}

					html, body {
						margin: 0;
						padding: 0;
						background: #ffffff;
						font-family: Arial, Helvetica, sans-serif;
						color: #000;
					}

					body {
						display: flex;
						justify-content: center;
						align-items: flex-start;
					}

					.receipt-print {
						width: 80mm;
						min-width: 80mm;
						max-width: 80mm;
						padding: 8px 10px;
						font-size: 12px;
						line-height: 1.4;
						color: #000;
						background: #fff;
					}

					.receipt-print * {
						color: #000 !important;
					}

					.receipt-print .text-center {
						text-align: center;
					}

					.receipt-print .font-bold {
						font-weight: 700;
					}

					.receipt-print .font-medium {
						font-weight: 600;
					}

					.receipt-print .text-sm {
						font-size: 13px;
					}

					.receipt-print .text-xs,
					.receipt-print .text-\\[11px\\] {
						font-size: 11px;
					}

					.receipt-print .text-\\[12px\\] {
						font-size: 12px;
					}

					.receipt-print .mt-1 {
						margin-top: 4px;
					}

					.receipt-print .mt-2 {
						margin-top: 8px;
					}

					.receipt-print .my-2 {
						margin-top: 8px;
						margin-bottom: 8px;
					}

					.receipt-print .pt-1 {
						padding-top: 4px;
					}

					.receipt-print .space-y-1 > * + * {
						margin-top: 4px;
					}

					.receipt-print .space-y-2 > * + * {
						margin-top: 8px;
					}

					.receipt-print .flex {
						display: flex;
					}

					.receipt-print .justify-between {
						justify-content: space-between;
					}

					.receipt-print .justify-center {
						justify-content: center;
					}

					.receipt-print .items-start {
						align-items: flex-start;
					}

					.receipt-print .gap-2 {
						gap: 8px;
					}

					.receipt-print .break-words {
						word-break: break-word;
					}

					.receipt-print .max-w-\\[150px\\] {
						max-width: 150px;
					}

					.receipt-print .text-right {
						text-align: right;
					}

					.receipt-print .border-t {
						border-top: 1px dashed #000;
					}

					.receipt-print .border-dashed {
						border-top-style: dashed;
					}

					.receipt-print .border-black {
						border-color: #000;
					}

					.receipt-print .w-full {
						width: 100%;
					}

					@media print {
						html, body {
							width: 80mm;
							min-width: 80mm;
							max-width: 80mm;
							overflow: hidden;
						}

						body {
							margin: 0;
							padding: 0;
						}

						.receipt-print {
							width: 80mm;
							min-width: 80mm;
							max-width: 80mm;
							box-shadow: none;
						}
					}
				</style>
			</head>
			<body>
				<div class="receipt-print">
					${printContents}
				</div>

				<script>
					window.onload = function () {
						window.focus();
						window.print();
						window.close();
					};
				</script>
			</body>
		</html>
	`)

		printWindow.document.close()
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[500px] max-h-[85vh] p-0 overflow-scroll '>
				<DialogHeader className='px-6 pt-6 pb-2'>
					<DialogTitle>Check preview</DialogTitle>
				</DialogHeader>

				<div className='px-6 pb-6'>
					<div className='flex gap-2 justify-end mb-4'>
						<Button variant='outline' onClick={handleDownloadImage}>
							Rasm yuklab olish <Download />
						</Button>
						<Button onClick={handlePrint} variant={'secondary'}>
							Print <Printer />
						</Button>
					</div>

					<ScrollArea className=' rounded-md border bg-muted/20 scroll-auto'>
						<div className='flex justify-center p-4'>
							<div
								ref={receiptRef}
								style={{
									width: '80mm',
									minWidth: '80mm',
									maxWidth: '80mm',
									padding: '8px 10px',
									background: '#fff',
									color: '#000',
									fontFamily: 'Arial, Helvetica, sans-serif',
									fontSize: '12px',
									lineHeight: '1.4',
								}}
							>
								<div className='text-center'>
									<div className='text-sm font-bold'>
										{store?.name || companyName}
									</div>
									{store?.address && (
										<div className='text-[11px] mt-1'>{store.address}</div>
									)}
									{store?.phone && (
										<div className='text-[11px] mt-1'>Tel: {store.id}</div>
									)}
								</div>

								<div className='border-t border-dashed border-black my-2' />

								<div className='space-y-1 text-[11px]'>
									<div className='flex justify-between gap-2'>
										<span>Sana:</span>
										<span>{formatDateTime(order.created_at)}</span>
									</div>

									<div className='flex justify-between gap-2'>
										<span>Order ID:</span>
										<span>{order.id ?? '-'}</span>
									</div>

									{shouldShowClient && (
										<>
											<div className='flex justify-between gap-2'>
												<span>Client:</span>
												<span>{client?.name || `#${order.client_id}`}</span>
											</div>

											{client?.phone && (
												<div className='flex justify-between gap-2'>
													<span>Tel:</span>
													<span>{client.phone}</span>
												</div>
											)}
										</>
									)}
								</div>

								<div className='border-t border-dashed border-black my-2' />

								<div className='text-center font-bold text-[12px]'>
									Mahsulotlar
								</div>

								<div className='mt-2 space-y-2'>
									{items.map((item, index) => {
										const itemName =
											item.name ||
											productMap[item.product_id] ||
											`Mahsulot #${item.product_id}`

										const lineSubtotal = item.price * item.count
										const lineDiscount = item.discount * item.count
										const lineTotal = (item.price - item.discount) * item.count

										return (
											<div
												key={`${item.product_id}-${index}`}
												className='text-[11px]'
											>
												<div className='font-medium break-words'>
													{itemName}
												</div>

												<div className='flex justify-between gap-2 mt-1'>
													<span>
														{item.count} x {formatMoney(item.price)}
													</span>
													<span>{formatMoney(lineSubtotal)}</span>
												</div>

												{item.discount > 0 && (
													<div className='flex justify-between gap-2'>
														<span>Chegirma</span>
														<span>-{formatMoney(lineDiscount)}</span>
													</div>
												)}

												<div className='flex justify-between gap-2 font-semibold'>
													<span>Jami</span>
													<span>{formatMoney(lineTotal)}</span>
												</div>

												<div className='border-t border-dashed border-black mt-2' />
											</div>
										)
									})}
								</div>

								<div className='space-y-1 text-[11px] mt-2'>
									<div className='flex justify-between gap-2'>
										<span>Subtotal:</span>
										<span>{formatMoney(subtotal)}</span>
									</div>

									<div className='flex justify-between gap-2'>
										<span>Chegirma:</span>
										<span>-{formatMoney(totalDiscount)}</span>
									</div>

									<div className='flex justify-between gap-2 font-bold text-[12px]'>
										<span>Umumiy summa:</span>
										<span>{formatMoney(grandTotal)} UZS</span>
									</div>
								</div>

								<div className='border-t border-dashed border-black my-2' />

								<div className='text-center font-bold text-[12px]'>
									To‘lovlar
								</div>

								<div className='space-y-1 text-[11px] mt-2'>
									{payments.map((payment, index) => {
										const paymentName =
											payment.name ||
											paymentTypeMap[payment.payment_type_id] ||
											`To‘lov turi #${payment.payment_type_id}`

										return (
											<div
												key={`${payment.payment_type_id}-${index}`}
												className='flex justify-between gap-2'
											>
												<span>{paymentName}</span>
												<span>{formatMoney(payment.price)}</span>
											</div>
										)
									})}

									<div className='flex justify-between gap-2 font-semibold pt-1'>
										<span>Jami to‘langan:</span>
										<span>{formatMoney(paidTotal)} UZS</span>
									</div>
								</div>

								{hasDebt && (
									<>
										<div className='border-t border-dashed border-black my-2' />

										<div className='text-center font-bold text-[12px]'>
											Qarz
										</div>

										<div className='space-y-2 text-[11px] mt-2'>
											{debts.map((debt, index) => (
												<div
													key={`${debt.client_id}-${index}`}
													className='space-y-1'
												>
													<div className='flex justify-between gap-2'>
														<span>Qarz summasi:</span>
														<span>{formatMoney(debt.price)} UZS</span>
													</div>

													<div className='flex justify-between gap-2'>
														<span>Qaytarish sanasi:</span>
														<span>{formatShortDate(debt.return_time)}</span>
													</div>

													{debt.reminder && (
														<div className='flex justify-between gap-2'>
															<span>Eslatma:</span>
															<span className='text-right break-words max-w-[150px]'>
																{debt.reminder}
															</span>
														</div>
													)}
												</div>
											))}

											<div className='flex justify-between gap-2 font-semibold'>
												<span>Jami qarz:</span>
												<span>{formatMoney(debtTotal)} UZS</span>
											</div>
										</div>
									</>
								)}

								<div className='border-t border-dashed border-black my-2' />

								<div className='text-center text-[11px]'>
									<div>{footerText}</div>
									<div className='mt-1'>Qayta tashrif buyuring</div>
								</div>
							</div>
						</div>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ReceiptPreviewModal

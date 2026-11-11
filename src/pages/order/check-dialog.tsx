import { useRef } from 'react'
import { toPng } from 'html-to-image'
import { Download, Printer } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import receiptStyles from './receipt.css?inline'

export interface ReceiptItem {
	product_id: number
	count: number
	discount: number
	price: number
	name?: string
}

export interface ReceiptOrder {
	id?: number | string
	order_number?: number
	created_at: string
	client_id?: number | null
	items: ReceiptItem[]
	payments: { payment_type_id: number; price: number; name?: string }[]
	debts: { price: number; return_time?: string; reminder?: string }[]
}

interface ReceiptPreviewModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	order: ReceiptOrder
	storeName?: string | null
	storeLoading: boolean
	client: { name: string; phone: string } | null
}

const money = new Intl.NumberFormat('uz-UZ')
const dateTime = new Intl.DateTimeFormat('uz-UZ', {
	dateStyle: 'short',
	timeStyle: 'short',
})
const dateOnly = new Intl.DateTimeFormat('uz-UZ', { dateStyle: 'short' })

function ReceiptRow({
	label,
	value,
}: {
	label: string
	value: string | number
}) {
	return (
		<div className='sale-receipt__row'>
			<span>{label}</span>
			<span>{value}</span>
		</div>
	)
}

export default function ReceiptPreviewModal({
	open,
	onOpenChange,
	order,
	storeName,
	storeLoading,
	client,
}: ReceiptPreviewModalProps) {
	const receiptRef = useRef<HTMLDivElement>(null)
	const { items, payments, debts } = order
	const receiptNumber = order.order_number ?? order.id
	const subtotal = items.reduce((sum, item) => sum + item.price * item.count, 0)
	const discount = items.reduce((sum, item) => sum + item.discount * item.count, 0)
	const paid = payments.reduce((sum, payment) => sum + payment.price, 0)
	const owed = debts.reduce((sum, debt) => sum + debt.price, 0)

	const handleDownloadImage = async () => {
		const receipt = receiptRef.current
		if (!receipt) return

		try {
			const dataUrl = await toPng(receipt, {
				pixelRatio: 2,
				backgroundColor: '#fff',
			})
			const link = document.createElement('a')
			link.download = `chek-${receiptNumber ?? Date.now()}.png`
			link.href = dataUrl
			link.click()
		} catch {
			toast.error('Chek rasmini yuklab bo‘lmadi')
		}
	}

	const handlePrint = () => {
		const receipt = receiptRef.current
		if (!receipt) return

		const printWindow = window.open('', '_blank', 'popup,width=420,height=720')
		if (!printWindow) {
			toast.error('Chop etish uchun qalqib chiquvchi oynaga ruxsat bering')
			return
		}

		const printDocument = printWindow.document
		printDocument.documentElement.lang = 'uz'
		printDocument.title = 'Sotuv cheki'
		printDocument.body.className = 'sale-receipt-print'

		const style = printDocument.createElement('style')
		style.textContent = receiptStyles
		printDocument.head.append(style)

		const printReceipt = printDocument.importNode(receipt, true)
		printDocument.body.append(printReceipt)

		printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true })
		printWindow.focus()
		printWindow.print()
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				aria-describedby={undefined}
				className='flex max-h-[85dvh] min-w-0 flex-col gap-3 p-0 sm:max-w-[420px]'
			>
				<DialogHeader className='px-4 pt-5 pr-12 text-left sm:px-6'>
					<DialogTitle>Sotuv cheki</DialogTitle>
				</DialogHeader>

				<div className='flex flex-wrap justify-end gap-2 px-4 sm:px-6'>
					<Button
						variant='outline'
						onClick={handleDownloadImage}
						disabled={storeLoading}
					>
						<Download /> Rasm yuklab olish
					</Button>
					<Button onClick={handlePrint} disabled={storeLoading}>
						<Printer /> Chop etish
					</Button>
				</div>

				{storeLoading && (
					<p role='status' className='px-4 text-sm text-muted-foreground sm:px-6'>
						Do‘kon ma’lumotlari yuklanmoqda…
					</p>
				)}

				<div className='mx-4 mb-4 min-h-0 overflow-y-auto rounded-md border bg-muted/40 p-2 sm:mx-6 sm:mb-6'>
					<style>{receiptStyles}</style>
					<div ref={receiptRef} className='sale-receipt'>
						{storeName?.trim() && (
							<header className='sale-receipt__header'>
								<p className='sale-receipt__store'>{storeName}</p>
							</header>
						)}

						<div className='sale-receipt__section sale-receipt__group'>
							<ReceiptRow label='Sana' value={dateTime.format(new Date(order.created_at))} />
							{receiptNumber !== undefined && (
								<ReceiptRow label='Chek raqami' value={receiptNumber} />
							)}
							{order.client_id && (
								<ReceiptRow label='Mijoz' value={client?.name || `#${order.client_id}`} />
							)}
							{client?.phone && <ReceiptRow label='Telefon' value={client.phone} />}
						</div>

						<section className='sale-receipt__section'>
							<h3>Mahsulotlar</h3>
							<ul>
								{items.map((item, index) => {
									const lineDiscount = item.discount * item.count
									const lineTotal = item.price * item.count - lineDiscount
									return (
										<li
											className='sale-receipt__item sale-receipt__group'
											key={`${item.product_id}-${index}`}
										>
											<p><strong>{item.name || `Mahsulot #${item.product_id}`}</strong></p>
											<ReceiptRow
												label={`${item.count} × ${money.format(item.price)}`}
												value={money.format(lineTotal)}
											/>
											{lineDiscount > 0 && (
												<ReceiptRow label='Chegirma' value={`−${money.format(lineDiscount)}`} />
											)}
										</li>
									)
								})}
							</ul>
						</section>

						<div className='sale-receipt__section sale-receipt__group'>
							{discount > 0 && (
								<>
									<ReceiptRow label='Oraliq summa' value={money.format(subtotal)} />
									<ReceiptRow label='Chegirma' value={`−${money.format(discount)}`} />
								</>
							)}
							<div className='sale-receipt__total'>
								<ReceiptRow
									label='Umumiy summa'
									value={`${money.format(subtotal - discount)} UZS`}
								/>
							</div>
						</div>

						{payments.length > 0 && (
							<section className='sale-receipt__section'>
								<h3>To‘lovlar</h3>
								{payments.map((payment, index) => (
									<div className='sale-receipt__group' key={`${payment.payment_type_id}-${index}`}>
										<ReceiptRow
											label={payment.name || `To‘lov turi #${payment.payment_type_id}`}
											value={money.format(payment.price)}
										/>
									</div>
								))}
								<ReceiptRow label='Jami to‘langan' value={`${money.format(paid)} UZS`} />
							</section>
						)}

						{debts.length > 0 && (
							<section className='sale-receipt__section'>
								<h3>Qarz</h3>
								{debts.map((debt, index) => (
									<div className='sale-receipt__group' key={index}>
										<ReceiptRow label='Qarz summasi' value={`${money.format(debt.price)} UZS`} />
										{debt.return_time && (
											<ReceiptRow
												label='Qaytarish sanasi'
												value={dateOnly.format(new Date(debt.return_time))}
											/>
										)}
										{debt.reminder && <ReceiptRow label='Eslatma' value={debt.reminder} />}
									</div>
								))}
								{debts.length > 1 && (
									<ReceiptRow label='Jami qarz' value={`${money.format(owed)} UZS`} />
								)}
							</section>
						)}

						<footer className='sale-receipt__section sale-receipt__group'>
							Xaridingiz uchun rahmat!
						</footer>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

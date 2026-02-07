import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { productUtils } from '@/utils/products'
import { reminderUtils } from '@/utils/reminder'
import { useMutation } from '@tanstack/react-query'
import { FileSpreadsheet, Download, ClipboardList, Loader2 } from 'lucide-react'
import { useState } from 'react'

const DownloadExel = () => {
	const [open, setOpen] = useState(false)
	const storeId = localStorage.getItem('storeId') || ''

	const handleFileDownload = (response: any, fileName: string) => {
		const blob = new Blob([response], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		})
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.setAttribute(
			'download',
			`${fileName}_${new Date().toLocaleDateString()}.xlsx`,
		)
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)
		setOpen(false) // Yuklab bo'lingach modalni yopish
	}

	const downloadMutationRem = useMutation({
		mutationFn: reminderUtils.getProductExport,
		onSuccess: res => handleFileDownload(res, 'eslatma_mahsulotlar'),
	})

	const downloadMutationLow = useMutation({
		mutationFn: () => productUtils.getLowProductExport(storeId),
		onSuccess: res => handleFileDownload(res, 'kam_qolgan_mahsulotlar'),
	})

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button className='h-12 bg-green-600 hover:bg-green-700 gap-2 text-white'>
					<FileSpreadsheet size={20} />
					Excel yuklab olish
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Excel hisobotlar</DialogTitle>
					<DialogDescription>
						Kerakli hisobot turini tanlang va yuklab oling.
					</DialogDescription>
				</DialogHeader>

				<div className='grid gap-4 py-4'>
					<Button
						variant='outline'
						className='h-20 flex justify-between px-6 hover:border-orange-500 hover:bg-orange-50/30 group'
						onClick={() => downloadMutationLow.mutate()}
						disabled={downloadMutationLow.isPending}
					>
						<div className='flex flex-col items-start gap-1'>
							<div className='flex items-center gap-2 font-semibold'>
								<ClipboardList className='text-orange-500' size={20} />
								<span>Kam qolganlar</span>
							</div>
							<span className='text-xs text-muted-foreground font-normal'>
								Ombor qoldig'i kam mahsulotlar
							</span>
						</div>
						{downloadMutationLow.isPending ? (
							<Loader2
								className='animate-spin text-muted-foreground'
								size={20}
							/>
						) : (
							<Download
								size={18}
								className='text-muted-foreground group-hover:text-orange-500 transition-colors'
							/>
						)}
					</Button>

					{/* 2. Eslatma mahsulotlar */}
					<Button
						variant='outline'
						className='h-20 flex justify-between px-6 hover:border-blue-500 hover:bg-blue-50/30 group'
						onClick={() => downloadMutationRem.mutate()}
						disabled={downloadMutationRem.isPending}
					>
						<div className='flex flex-col items-start gap-1'>
							<div className='flex items-center gap-2 font-semibold'>
								<FileSpreadsheet className='text-blue-500' size={20} />
								<span>Eslatmalar</span>
							</div>
							<span className='text-xs text-muted-foreground font-normal'>
								Eslatma sifatida qo'shilganlar
							</span>
						</div>
						{downloadMutationRem.isPending ? (
							<Loader2
								className='animate-spin text-muted-foreground'
								size={20}
							/>
						) : (
							<Download
								size={18}
								className='text-muted-foreground group-hover:text-blue-500 transition-colors'
							/>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default DownloadExel

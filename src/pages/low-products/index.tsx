import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LowProductTable from './low-product-table'
import ReminderTable from './reminder-table'
import { BellOff, ChartLine } from 'lucide-react'
import DownloadExel from './download-exel'
import AddReminder from './add-reminder'

const LowProducts = () => {
	return (
		<div className='w-full'>
			<div className='flex justify-between items-center'>
				<h2 className='text-xl font-medium'>Kam qolgan mahsulotlar</h2>
			</div>
			<Tabs defaultValue='low-stock' className='w-full'>
				<div className='flex items-center justify-between'>
					<TabsList>
						<TabsTrigger value='low-stock'>
							<ChartLine /> Kam qolganlar
						</TabsTrigger>
						<TabsTrigger value='reminders'>
							<BellOff />
							Eslatmalar
						</TabsTrigger>
					</TabsList>
					<div className='flex gap-x-3'>
						<DownloadExel />
						<AddReminder />
					</div>
				</div>

				<TabsContent value='low-stock'>
					<LowProductTable />
				</TabsContent>
				<TabsContent value='reminders'>
					<ReminderTable />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default LowProducts

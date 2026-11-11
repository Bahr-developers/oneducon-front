import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provide'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const themeOptions = [
	{ value: 'light', label: 'Och', icon: Sun },
	{ value: 'dark', label: 'To‘q', icon: Moon },
	{ value: 'system', label: 'Tizimga mos', icon: Monitor },
] as const

export function AppearanceSettings() {
	const { theme, setTheme } = useTheme()

	return (
		<Card className='gap-4'>
			<CardHeader>
				<CardTitle>Interfeys mavzusi</CardTitle>
				<CardDescription>Tanlov shu brauzerda avtomatik saqlanadi.</CardDescription>
			</CardHeader>
			<CardContent>
				<fieldset className='grid gap-2 sm:grid-cols-3'>
					<legend className='sr-only'>Interfeys mavzusi</legend>
					{themeOptions.map(({ value, label, icon: Icon }) => (
						<label key={value} className='relative block cursor-pointer'>
							<input
								type='radio'
								name='theme'
								value={value}
								checked={theme === value}
								onChange={() => setTheme(value)}
								className='peer sr-only'
							/>
							<span className='flex min-h-12 items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 pr-9 text-sm font-medium hover:bg-muted peer-checked:border-[#536BE8] peer-checked:bg-[#536BE8]/10 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background sm:h-full sm:flex-col sm:items-start sm:justify-center'>
								<Icon className='size-[18px] shrink-0 text-muted-foreground' aria-hidden='true' />
								{label}
							</span>
							<Check
								className='pointer-events-none absolute right-3 top-3.5 size-4 text-[#4056C8] opacity-0 peer-checked:opacity-100 dark:text-[#A6B2FF]'
								aria-hidden='true'
							/>
						</label>
					))}
				</fieldset>
			</CardContent>
		</Card>
	)
}

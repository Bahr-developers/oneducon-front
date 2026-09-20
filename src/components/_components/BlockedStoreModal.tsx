import {
    AlertCircle,
    ArrowRight,
    Phone,
    ShieldAlert,
} from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface BlockedStoreModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BlockedStoreModal({
    open,
    onOpenChange,
}: BlockedStoreModalProps) {
    const handleContactAdmin = () => {
        window.open('tel:+998900167700')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader className="items-center text-center">
                    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
                        <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>

                    <DialogTitle className="text-xl">
                        Do‘kon vaqtincha bloklangan
                    </DialogTitle>

                    <DialogDescription className="pt-2 text-center text-sm leading-6">
                        Ushbu do‘kon uchun tizimga kirish vaqtincha
                        cheklangan.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                    <div className="flex gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-red-900 dark:text-red-200">
                                To‘lov amalga oshirilmagan
                            </p>

                            <p className="text-sm leading-5 text-red-700 dark:text-red-300">
                                Do‘konni qayta aktivlashtirish uchun
                                administrator bilan bog‘lanishingiz kerak.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-1 rounded-xl border bg-muted/40 p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                Admin bilan bog‘laning
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                To‘lovni amalga oshirgandan so‘ng
                                administrator do‘koningizni qayta
                                aktivlashtirishi mumkin.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => onOpenChange(false)}
                    >
                        Yopish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

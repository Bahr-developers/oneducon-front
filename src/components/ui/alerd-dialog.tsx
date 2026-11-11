import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"


interface deleteConfirmType {
    onConfirm: () => void
    title?: string,
    variant?: 'outline' | 'ghost' | 'default'
    description?: string
    disabled?: boolean
}

export function DeleteConfirm({ onConfirm, title, variant = 'ghost', description, disabled }: deleteConfirmType) {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant} size="sm" disabled={disabled}>
                    {title}
                    <Trash2 className="h-5 w-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Siz rostdan ham o‘chirmoqchimisiz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description ?? 'Bu amalni ortga qaytarib bo‘lmaydi. Ma’lumot bazadan butunlay o‘chiriladi.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Ha, o‘chirish</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

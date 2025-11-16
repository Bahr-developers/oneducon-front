import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface USDData {
    usd_rate?: number;
    // Boshqa ma'lumotlar...
}

interface USDRateDialogProps {
    data: USDData;
    isOpen: boolean;
    onClose: () => void;
}

export function USDRateDialog({ data, isOpen, onClose }: USDRateDialogProps) {
    const navigate = useNavigate();

    const handleSettings = () => {
        navigate('/dashboard/profile?activeTab=settings');
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const shouldOpen = !data?.usd_rate && isOpen;

    return (
        <Dialog open={shouldOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-yellow-500" />
                        <DialogTitle>USD kursi topilmadi !</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Tizimda USD kursi sozlanmagan. Ma'lumotlarni to'liq ko'rish va
                        hisob-kitoblarni amalga oshirish uchun sozlamalarga o'tib USD kursini
                        qo'shing yoki yangilang.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Settings className="h-5 w-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                        USD kursi: <span className="font-semibold">Mavjud emas</span>
                    </p>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1 sm:flex-none"
                    >
                        Bekor Qilish
                    </Button>
                    <Button
                        onClick={handleSettings}
                        className="flex-1 sm:flex-none"
                    >
                        Sozlamalarga o'tish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
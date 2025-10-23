import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { unitUtils } from "@/utils/units";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
const CreateUnit = () => {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const queryClient = useQueryClient()
    const storeId = localStorage.getItem('storeId') || 1
    const createCategory = useMutation({
        mutationFn: unitUtils.postUnit,
        onSuccess: () => {
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['get_all_units'] })
            toast.success('Yangi kategoriya yaratildi ✅')
        },
        onError: (err) => {
            console.log(err);
            toast.error('Error')
        }
    })

    const handleSubmit = () => {
        createCategory.mutate({
            name: text,
            store_id: Number(storeId)
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center gap-x-2 border p-2 rounded-sm text-sm cursor-pointer">
                Birlik yaratish <PlusIcon />
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Birlik yaratish</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col w-full space-y-5">
                    <label>
                        <span>Nomi</span>
                        <Input autoFocus onChange={(e) => setText(e.target.value)} placeholder="Kategoriya nomini kiriting..." className="h-12 mt-2" />
                    </label>
                    <Button onClick={handleSubmit} className="w-40 ml-auto">Yaratish</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateUnit;
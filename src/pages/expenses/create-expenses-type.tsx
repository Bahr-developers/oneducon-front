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
import { ExpensesTypeUtils } from "@/utils/expenses-type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
const CreateExpensesType = () => {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const storeId = localStorage.getItem('storeId') || 1
    const queryClient = useQueryClient()
    const createExpensesType = useMutation({
        mutationFn: ExpensesTypeUtils.posetExpensesType,
        onSuccess: () => {
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['get_all_categories'] })
            toast.success('Yangi kategoriya yaratildi ✅')
        },
        onError: (err) => {
            console.log(err);
            toast.error('Error')
        }
    })

    const handleSubmit = () => {
        createExpensesType.mutate({
            name: text,
            store_id: Number(storeId)
        })
    }

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger onClick={() => setOpen(true)} className="flex items-center gap-x-2 border p-2 rounded-sm text-sm cursor-pointer">
                Kategoriya yaratish <PlusIcon />
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kategoriya yaratish</DialogTitle>
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

export default CreateExpensesType;
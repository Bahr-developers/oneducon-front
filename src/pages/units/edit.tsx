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
import { categoryUtils } from "@/utils/categories";
import { unitUtils } from "@/utils/units";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Unit {
    id: string;
    name: string;
}
interface propsEdit {
    item: Unit;
    type: 'category' | 'unit';
}


const EditUnitCategory = ({ item, type }: propsEdit) => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const [text, setText] = useState(item.name)
    const editCategory = useMutation({
        mutationFn: categoryUtils.patchCategory,
        onSuccess: (data) => {
            toast.success(data?.message)
            queryClient.invalidateQueries({ queryKey: ['get_all_categories'] })
            setOpen(false)
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>
            console.log(err);
            toast.error(error?.response?.data?.message || "someting went woring");
        }
    })

    const editUnits = useMutation({
        mutationFn: unitUtils.patchUnit,
        onSuccess: (data) => {
            toast.success(data?.message)
            queryClient.invalidateQueries({ queryKey: ['get_all_units'] })
            setOpen(false)
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>
            console.log(err);
            toast.error(error?.response?.data?.message || "someting went woring");
        }
    })


    const handleEdit = () => {
        if (type === 'category') {
            editCategory.mutate({
                id: item.id,
                name: text,
            })
        } else {
            editUnits.mutate({
                id: item.id,
                name: text,
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} className="flex items-center cursor-pointer">
                <Edit className="h-4 w-4" />
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type == 'category' ? 'Kategoriya' : 'Birliklar'}</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                    <div className="flex flex-col space-y-5 w-full">
                        <Input className="h-12" defaultValue={text} onChange={(value) => setText(value.target.value)} />

                        <Button onClick={handleEdit}>Tahrirlash</Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default EditUnitCategory;
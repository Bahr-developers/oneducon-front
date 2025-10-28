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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryType, product } from "@/types";
import { categoryUtils } from "@/utils/categories";
import { productUtils } from "@/utils/products";
import { unitUtils } from "@/utils/units";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const fields = [
    { name: "name", label: "Nomi", type: "text" },
    { name: "count", label: "Miqdori", type: "number" },
    { name: "remine_count", label: "Eslatma miqdori", type: "number" },
    { name: "tan_narx_uzb", label: "Tan narxi (UZS)", type: "number" },
    { name: "tan_narx_dol", label: "Tan narxi ($)", type: "number" },
    { name: "saler_narxi", label: "Sotuv narxi ($)", type: "number" },
];



const EditProsucts = (product: product) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<Record<string, string | number>>({
        name: product.name,
        count: product.quantity,
        remine_count: product.reminder_quantity,
        tan_narx_uzb: product.cost_price,
        tan_narx_dol: product.cost_price_usd,
        saler_narxi: product.sale_price,
        categoryId: product.category.id,
        unitId: product.unit.id
    });
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const queryClient = useQueryClient()
    const { data: categories } = useQuery({
        queryKey: ['get_all_categories'],
        queryFn: categoryUtils.getCategory
    })
    const { data: units } = useQuery({
        queryKey: ['get_all_units'],
        queryFn: unitUtils.getUnit
    })

    const editProduct = useMutation({
        mutationFn: productUtils.patchProduct,
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['get_all_procusts'] })
            setOpen(false)
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    })

    const handelProduct = () => {
        editProduct.mutate({
            category_id: Number(data.categoryId),
            name: String(data.name),
            cost_price: Number(data.tan_narx_uzb),
            cost_price_usd: Number(data.tan_narx_dol),
            quantity: Number(data.count),
            reminder_quantity: Number(data.remine_count),
            sale_price: Number(data.saler_narxi),
            sale_price_usd: +(Number(data.saler_narxi) / 12500).toFixed(2),
            unit_id: Number(data.unitId),
            usd_rate: 12500,
            id: product.id
        })
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const next = inputRefs.current[idx + 1];
            if (next) next.focus();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer">
                <Pencil size={20} /></DialogTrigger>

            <DialogContent w="md:w-[900px]">
                <DialogHeader>
                    <DialogTitle>Edit product</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                    <div className="grid grid-cols-2 gap-4">
                        {fields.map((field, idx) => (
                            <label key={field.name} className="w-full flex flex-col space-y-1">
                                <span>{field.label}</span>
                                <Input
                                    autoFocus={idx == 0}
                                    ref={(el) => {
                                        if (el) inputRefs.current[idx] = el;
                                    }}
                                    name={field.name}
                                    type={field.type}
                                    className="h-12"
                                    placeholder={`${field.label} kiriting...`}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleEnter(e, idx)}
                                    defaultValue={data[field.name]}
                                />
                            </label>
                        ))}

                        <label className="w-full flex flex-col space-y-1">
                            <span>O‘lchov birligi</span>
                            <Select
                                defaultValue={product.unit.id}
                                onValueChange={(val) =>
                                    setData((prev) => ({ ...prev, unitId: val }))
                                }
                            >
                                <SelectTrigger className="w-full h-12">
                                    <SelectValue placeholder="Birlik tanlang..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {units?.data?.map((el: categoryType) => (
                                        <SelectItem key={el.id} value={el.id}>{el.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>

                        <label className="w-full flex flex-col space-y-1">
                            <span>Kategoriya</span>
                            <Select
                                defaultValue={product.category.id}
                                onValueChange={(val) =>
                                    setData((prev) => ({ ...prev, categoryId: val }))
                                }
                            >
                                <SelectTrigger className="w-full h-12">
                                    <SelectValue placeholder="Kategoriya tanlang..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.data?.map((el: categoryType) => (
                                        <SelectItem key={el.id} value={el.id}>{el.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>
                    </div>

                    <div className="w-full flex justify-end items-center gap-x-3 mt-3">
                        <Button onClick={handelProduct}>Saqlash</Button>
                        <Button>Bekor qilish</Button>
                    </div>

                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default EditProsucts;
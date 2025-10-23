import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import FullPageOverlay from "@/components/ui/full-screen";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productUtils } from "@/utils/products";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { categoryUtils } from "@/utils/categories";
import { unitUtils } from "@/utils/units";
import { categoryType } from "@/types";

const fields = [
    { name: "name", label: "Nomi", type: "text" },
    { name: "count", label: "Miqdori", type: "number" },
    { name: "remine_count", label: "Eslatma miqdori", type: "number" },
    { name: "tan_narx_uzb", label: "Tan narxi (UZS)", type: "number" },
    { name: "tan_narx_dol", label: "Tan narxi ($)", type: "number" },
    { name: "saler_narxi", label: "Sotuv narxi", type: "number" },
];

const ProductCreate = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<Record<string, string>>({});
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const storeId = localStorage.getItem('storeId') || 1
    const queryClient = useQueryClient()
    const createProducts = useMutation({
        mutationFn: productUtils.postProduct,
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['get_all_procusts'] })
            setOpen(false)
            setData({})
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>
            toast.error(error?.response?.data?.message || 'Somethong went wrong!')
        }
    })
    const { data: categories } = useQuery({
        queryKey: ['get_all_categories'],
        queryFn: categoryUtils.getCategory
    })
    const { data: units } = useQuery({
        queryKey: ['get_all_units'],
        queryFn: unitUtils.getUnit
    })

    const onHandleSumbit = () => {
        createProducts.mutate({
            category_id: Number(data.categoryId),
            cost_price: Number(data.tan_narx_uzb),
            cost_price_usd: Number(data.tan_narx_dol),
            name: data.name,
            quantity: Number(data.count),
            reminder_quantity: Number(data.remine_count),
            sale_price: Number(data.saler_narxi),
            unit_id: Number(data.unitId),
            store_id: Number(storeId),
            usd_rate: 12500,
            sale_price_usd: Number(data.saler_narxi) / 12500
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
        <div>
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
                Yangi mahsulot
            </button>

            <FullPageOverlay open={open} onOpenChange={setOpen}>
                <FullPageOverlay.Content title="Mahsulot yaratish">
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
                                    value={data[field.name] || ""}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleEnter(e, idx)}
                                />
                            </label>
                        ))}

                        <label className="w-full flex flex-col space-y-1">
                            <span>O‘lchov birligi</span>
                            <Select
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

                    <div className="flex items-center gap-x-5 mt-5">
                        <Button onClick={onHandleSumbit}>Yaratish</Button>
                        <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
                    </div>
                </FullPageOverlay.Content>
            </FullPageOverlay>
        </div>
    );
};

export default ProductCreate;

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
import { product } from "@/types";
import { Eye } from "lucide-react";
import { useState } from "react";

const fields = [
    { name: "name", label: "Nomi", type: "text" },
    { name: "count", label: "Miqdori", type: "number" },
    { name: "remine_count", label: "Eslatma miqdori", type: "number" },
    { name: "tan_narx_uzb", label: "Tan narxi (UZS)", type: "number" },
    { name: "tan_narx_dol", label: "Tan narxi ($)", type: "number" },
    { name: "saler_narxi", label: "Sotuv narxi ($)", type: "number" },
    { name: "category", label: "Category", type: "string" },
    { name: "unit", label: "Birliklar", type: "string" },
];

const ProductView = (product: product) => {
    const [open, setOpen] = useState(false);
    const [data] = useState<Record<string, string | number>>({
        name: product.name,
        count: product.quantity,
        remine_count: product.reminder_quantity,
        tan_narx_uzb: product.cost_price,
        tan_narx_dol: product.cost_price_usd,
        saler_narxi: product.sale_price,
        category: product.category.name,
        unit: product.unit.name,
    });

    console.log(data);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer">
                <Eye size={20} /></DialogTrigger>

            <DialogContent w="md:w-[900px]">
                <DialogHeader>
                    <DialogTitle>Edit product</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                    <div className="grid grid-cols-2 gap-4">
                        {fields.map((field) => (
                            <label key={field.name} className="w-full flex flex-col space-y-1">
                                <span>{field.label}</span>
                                <Input
                                    disabled
                                    name={field.name}
                                    type={field.type}
                                    className="h-12"
                                    placeholder={`${field.label} kiriting...`}
                                    value={data[field.name]}
                                />
                            </label>
                        ))}
                    </div>

                    <div className="w-full flex justify-end items-center gap-x-3 mt-3">
                        <Button onClick={() => setOpen(false)}>Yopish</Button>
                    </div>

                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ProductView;
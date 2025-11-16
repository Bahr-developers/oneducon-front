/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DollarSign, TrendingUp, X } from "lucide-react";
import NumberInput from "@/components/_components/number-input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productUtils } from "@/utils/products";
import { categoryType, product } from "@/types";
import { categoryUtils } from "@/utils/categories";
import { unitUtils } from "@/utils/units";
import toast from "react-hot-toast";

interface ProductFormData {
    name: string | '';
    count: number;
    remine_count: number;
    tan_narx_uzb: number;
    tan_narx_dol: number;
    saler_narxi: number;
    saler_narxi_dol: number;
    unitId: string;
    categoryId: string;
}

const ProductCreate = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<Partial<ProductFormData>>({});
    const [usdRate, setUsdRate] = useState(12500);
    const [isEditingRate, setIsEditingRate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | HTMLButtonElement | null)[]>([]);
    // Validate form - all required fields filled
    const queryClient = useQueryClient()
    const isFormValid = useMemo(() => {
        return !!(
            data.name?.trim() &&
            data.count &&
            data.count > 0 &&
            data.tan_narx_uzb &&
            data.tan_narx_uzb > 0 &&
            data.saler_narxi &&
            data.saler_narxi > 0 &&
            data.unitId &&
            data.categoryId
        );
    }, [data]);

    const handleEnter = (e: React.KeyboardEvent, idx: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();

            const next = inputRefs.current[idx + 1];
            if (next) {
                next.focus();
            }
        }
    };
    const { data: productData } = useQuery<{ data: product[] }>({
        queryKey: ['get_all_procusts'],
        queryFn: productUtils.getProductsAlls
    })

    const { data: categories } = useQuery({
        queryKey: ['get_catigories'],
        queryFn: categoryUtils.getCategory
    })

    const { data: units } = useQuery({
        queryKey: ['get_units'],
        queryFn: unitUtils.getUnit
    })
    const products = productData?.data || []


    const [isDuplicate, setIsDuplicate] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData(prev => ({
            ...prev,
            name: value
        }));

        // To‘liq mos nomni tekshirish
        const exists = products.some(
            (p) => p.name.toLowerCase() === value.trim().toLowerCase()
        );

        setIsDuplicate(exists);
        setShowSuggestions(true);
    };

    const handleSelect = (selected: string) => {
        setData(prev => ({
            ...prev,
            name: selected
        }));
        setIsDuplicate(true); // tanlagan mahsulot mavjud
        setShowSuggestions(false); // suggest yopilsin
    };

    const filteredProducts = useMemo(() => {
        const nameValue = data.name ?? "";
        if (!nameValue.trim()) return [];
        return products
            .filter((p) =>
                p.name.toLowerCase().includes(nameValue.trim().toLowerCase())
            )
            .slice(0, 5);
    }, [data.name, products]);

    const handleNumberChange = (name: string, value: number) => {
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCostPriceUZS = (value: number) => {
        setData(prev => ({
            ...prev,
            tan_narx_uzb: value,
            tan_narx_dol: usdRate > 0 ? Math.round((value / usdRate) * 100) / 100 : 0
        }));
    };

    const handleCostPriceUSD = (value: number) => {
        setData(prev => ({
            ...prev,
            tan_narx_dol: value,
            tan_narx_uzb: Math.round(value * usdRate)
        }));
    };

    const handleSalePriceUZS = (value: number) => {
        setData(prev => ({
            ...prev,
            saler_narxi: value,
            saler_narxi_dol: usdRate > 0 ? Math.round((value / usdRate) * 100) / 100 : 0
        }));
    };

    const handleSalePriceUSD = (value: number) => {
        setData(prev => ({
            ...prev,
            saler_narxi_dol: value,
            saler_narxi: Math.round(value * usdRate)
        }));
    };

    const handleUsdRateChange = (value: number) => {
        setUsdRate(value);

        setData(prev => ({
            ...prev,
            tan_narx_dol: prev.tan_narx_uzb && value > 0
                ? Math.round((prev.tan_narx_uzb / value) * 100) / 100
                : prev.tan_narx_dol || 0,
            saler_narxi_dol: prev.saler_narxi && value > 0
                ? Math.round((prev.saler_narxi / value) * 100) / 100
                : prev.saler_narxi_dol || 0
        }));
    };

    const createProduct = useMutation({
        mutationFn: productUtils.postProduct,
        onSuccess: () => {
            toast.success('Mahsulot muvaffaqiyatli yaratildi');
            setIsSubmitting(false);
            queryClient.invalidateQueries({ queryKey: ['get_all_procusts'] })
            handleReset();
        },
        onError: (err) => {
            console.log(err);
            toast.error('Something went wrong!')
        }
    })

    const onHandleSubmit = () => {
        if (!isFormValid) return;

        setIsSubmitting(true);

        const productData = {
            category_id: +data.categoryId!,
            cost_price: data.tan_narx_uzb!,
            cost_price_usd: data.tan_narx_dol || 0,
            name: data.name!,
            quantity: data.count!,
            reminder_quantity: data.remine_count || 0,
            sale_price: data.saler_narxi!,
            sale_price_usd: data.saler_narxi_dol || 0,
            unit_id: +data.unitId!,
            store_id: 1,
            usd_rate: usdRate
        };


        createProduct.mutate(productData)

    };

    const handleReset = () => {
        setData({});
        setOpen(false);
    };

    if (!open) {
        return (
            <Button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                size="lg"
            >
                <TrendingUp size={18} className="mr-2" />
                Yangi mahsulot
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 overflow-y-auto">
            <div className="min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Mahsulot yaratish</h2>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full ">
                            <div className="relative w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium">
                                    Masulot nomi <span className="text-red-500">*</span>
                                </span>
                                <Input
                                    autoFocus
                                    type="text"
                                    ref={el => { inputRefs.current[0] = el }}
                                    placeholder="Mahsulot nomi"
                                    value={data.name ?? ''}
                                    onChange={handleNameChange}
                                    onKeyDown={(e) => handleEnter(e, 0)}
                                    onFocus={() => setShowSuggestions(true)}
                                    className={`h-12 transition-all ${isDuplicate ? "border-red-500 text-red-600" : "border-gray-300"
                                        }`}
                                    autoComplete="off"
                                />
                                {showSuggestions && filteredProducts.length > 0 && (
                                    <ul className="absolute z-10 bg-[#514e4e] text-white  border rounded-md mt-20 shadow-lg w-full max-h-40">
                                        {filteredProducts.map((p) => (
                                            <li
                                                key={p.id}
                                                onClick={() => handleSelect(p.name)}
                                                className="px-3 py-1 cursor-pointer"
                                            >
                                                {p.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Duplicate xabar */}
                                {isDuplicate && (
                                    <p className="text-[12px] text-red-500 mt-1 absolute right-0 ">❌ Bu mahsulot mavjud</p>
                                )}
                            </div>

                            {/* Miqdori */}
                            <label className="w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium">
                                    Miqdori <span className="text-red-500">*</span>
                                </span>
                                <NumberInput
                                    ref={(el) => {
                                        inputRefs.current[1] = el;
                                    }}
                                    value={data.count || 0}
                                    onChange={({ raw }) => handleNumberChange('count', raw)}
                                    placeholder="Masalan: 100"
                                    className="h-12"
                                    onKeyDown={(e) => handleEnter(e, 1)}
                                />
                            </label>

                            {/* Eslatma miqdori */}
                            <label className="w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium">Eslatma miqdori</span>
                                <NumberInput
                                    value={data.remine_count || 0}
                                    ref={(el) => {
                                        inputRefs.current[2] = el;
                                    }}
                                    onChange={({ raw }) => handleNumberChange('remine_count', raw)}
                                    placeholder="Masalan: 10"
                                    className="h-12"
                                    onKeyDown={(e) => handleEnter(e, 2)}
                                />
                            </label>

                            {/* USD Rate */}
                            <label className="w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <DollarSign size={16} />
                                    USD kursi
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingRate(!isEditingRate)}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {isEditingRate ? 'Saqlash' : "O'zgartirish"}
                                    </button>
                                </span>
                                <NumberInput
                                    value={usdRate}
                                    ref={(el) => {
                                        inputRefs.current[3] = el;
                                    }}
                                    onChange={({ raw }) => handleUsdRateChange(raw)}
                                    className={`h-12 ${!isEditingRate ? 'bg-muted cursor-not-allowed' : ''}`}
                                    readonly={!isEditingRate}
                                    onKeyDown={(e) => handleEnter(e, 3)}
                                />
                            </label>

                            {/* Tan narxi UZS */}
                            <label className="w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium">
                                    Tan narxi (UZS) <span className="text-red-500">*</span>
                                </span>
                                <NumberInput
                                    ref={(el) => {
                                        inputRefs.current[4] = el;
                                    }}
                                    value={data.tan_narx_uzb || 0}
                                    onChange={({ raw }) => handleCostPriceUZS(raw)}
                                    placeholder="Masalan: 5 000 000"
                                    className="h-12"
                                    onKeyDown={(e) => handleEnter(e, 4)}
                                />
                            </label>

                            {/* Tan narxi USD */}
                            <label className="w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <DollarSign size={16} />
                                    Tan narxi ($)
                                </span>
                                <div className="relative">
                                    <Input
                                        ref={el => { inputRefs.current[5] = el }}
                                        type="number"
                                        step="0.01"
                                        className="h-12 pr-10"
                                        placeholder="Masalan: 400"
                                        value={data.tan_narx_dol || ""}
                                        onChange={(e) => handleCostPriceUSD(parseFloat(e.target.value) || 0)}
                                        onKeyDown={(e) => handleEnter(e, 5)}
                                    />
                                    <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                                </div>
                            </label>

                            {/* Sotuv narxi UZS */}
                            <label className="w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium">
                                    Sotuv narxi (UZS) <span className="text-red-500">*</span>
                                </span>
                                <NumberInput
                                    ref={(el) => {
                                        inputRefs.current[6] = el;
                                    }}
                                    value={data.saler_narxi || 0}
                                    onChange={({ raw }) => handleSalePriceUZS(raw)}
                                    placeholder="Masalan: 6 000 000"
                                    className="h-12"
                                    onKeyDown={(e) => handleEnter(e, 6)}
                                />
                            </label>

                            {/* Sotuv narxi USD */}
                            <label className="w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <DollarSign size={16} />
                                    Sotuv narxi ($)
                                </span>
                                <div className="relative">
                                    <Input
                                        ref={el => { inputRefs.current[7] = el }}
                                        type="number"
                                        step="0.01"
                                        className="h-12 pr-10"
                                        placeholder="Masalan: 480"
                                        value={data.saler_narxi_dol || ""}
                                        onChange={(e) => handleSalePriceUSD(parseFloat(e.target.value) || 0)}
                                        onKeyDown={(e) => handleEnter(e, 7)}
                                    />
                                    <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                                </div>
                            </label>

                            {/* O'lchov birligi */}
                            <label className="w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium">
                                    O'lchov birligi <span className="text-red-500">*</span>
                                </span>
                                <Select
                                    value={data.unitId}
                                    onValueChange={(val) => {
                                        setData(prev => ({ ...prev, unitId: val }));
                                        setTimeout(() => inputRefs.current[9]?.focus(), 100);
                                    }}
                                >
                                    <SelectTrigger
                                        ref={(el) => {
                                            inputRefs.current[8] = el;
                                        }}
                                        className="w-full h-12"
                                        onKeyDown={(e) => handleEnter(e, 8)}
                                    >
                                        <SelectValue placeholder="Birlik tanlang..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units?.data?.map((el: categoryType) => (
                                            <SelectItem key={el.id} value={el.id}>
                                                {el.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </label>

                            {/* Kategoriya */}
                            <label className="w-full flex flex-col space-y-2">
                                <span className="text-sm font-medium">
                                    Kategoriya <span className="text-red-500">*</span>
                                </span>
                                <Select
                                    value={data.categoryId}
                                    onValueChange={(val) => {
                                        setData(prev => ({ ...prev, categoryId: val }));
                                        setTimeout(() => inputRefs.current[10]?.focus(), 100);
                                    }}
                                >
                                    <SelectTrigger
                                        ref={el => { inputRefs.current[9] = el }}
                                        className="w-full h-12"
                                        onKeyDown={(e) => handleEnter(e, 9)}
                                    >
                                        <SelectValue placeholder="Kategoriya tanlang..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.data?.map((el: categoryType) => (
                                            <SelectItem key={el.id} value={el.id}>
                                                {el.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </label>
                        </div>

                        {/* Info Box */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Eslatma:</strong> UZS va USD narxlari bir-biriga bog'langan.
                                Qaysi birida yozsangiz ham, ikkinchisi avtomatik hisoblanadi.
                                <br />
                                Joriy kurs: <span className="font-mono font-semibold">{usdRate.toLocaleString()} so'm</span>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Button
                                ref={el => { inputRefs.current[10] = el }}
                                onClick={onHandleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                size="lg"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Yuklanmoqda...' : 'Yaratish'}
                            </Button>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                size="lg"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Bekor qilish
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCreate;
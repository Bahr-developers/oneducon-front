import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FullPageOverlay from "@/components/ui/full-screen";
import { Input } from "@/components/ui/input";
import NumberInput from "@/components/_components/number-input";
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
import { DollarSign, TrendingUp } from "lucide-react";

interface ProductFormData {
    name: string;
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
    const inputRefs = useRef<(HTMLInputElement | HTMLButtonElement | null)[]>([]);
    const storeId = localStorage.getItem('storeId') || '1';
    const queryClient = useQueryClient();
    const usdRate = Number(localStorage.getItem('usd_rate')) || 12500;

    const createProducts = useMutation({
        mutationFn: productUtils.postProduct,
        onSuccess: (response) => {
            toast.success(response.message || 'Mahsulot muvaffaqiyatli yaratildi');
            queryClient.invalidateQueries({ queryKey: ['get_all_procusts'] });
            setOpen(false);
            setData({});
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error?.response?.data?.message || 'Xatolik yuz berdi!');
        }
    });

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['get_all_categories'],
        queryFn: categoryUtils.getCategory
    });

    const { data: units, isLoading: unitsLoading } = useQuery({
        queryKey: ['get_all_units'],
        queryFn: unitUtils.getUnit
    });

    // Auto-convert UZS to USD when tan_narx_uzb changes
    useEffect(() => {
        if (data.tan_narx_uzb && usdRate) {
            const usdValue = data.tan_narx_uzb / usdRate;
            setData(prev => ({
                ...prev,
                tan_narx_dol: Math.round(usdValue * 100) / 100 // 2 decimal places
            }));
        }
    }, [data.tan_narx_uzb, usdRate]);

    // Auto-convert UZS to USD when saler_narxi changes
    useEffect(() => {
        if (data.saler_narxi && usdRate) {
            const usdValue = data.saler_narxi / usdRate;
            setData(prev => ({
                ...prev,
                saler_narxi_dol: Math.round(usdValue * 100) / 100
            }));
        }
    }, [data.saler_narxi, usdRate]);

    const onHandleSubmit = () => {
        // Validation
        if (!data.name?.trim()) {
            toast.error('Mahsulot nomini kiriting');
            return;
        }
        if (!data.count || data.count <= 0) {
            toast.error('Miqdorni kiriting');
            return;
        }
        if (!data.tan_narx_uzb || data.tan_narx_uzb <= 0) {
            toast.error('Tan narxini kiriting');
            return;
        }
        if (!data.saler_narxi || data.saler_narxi <= 0) {
            toast.error('Sotuv narxini kiriting');
            return;
        }
        if (!data.unitId) {
            toast.error('O\'lchov birligini tanlang');
            return;
        }
        if (!data.categoryId) {
            toast.error('Kategoriyani tanlang');
            return;
        }

        createProducts.mutate({
            category_id: +data.categoryId,
            cost_price: data.tan_narx_uzb,
            cost_price_usd: data.tan_narx_dol || 0,
            name: data.name,
            quantity: data.count,
            reminder_quantity: data.remine_count || 0,
            sale_price: data.saler_narxi,
            sale_price_usd: data.saler_narxi_dol || 0,
            unit_id: +data.unitId,
            store_id: +storeId,
            usd_rate: usdRate
        });
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleNumberChange = (name: string, value: number) => {
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEnter = (e: React.KeyboardEvent, idx: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const next = inputRefs.current[idx + 1];
            if (next) {
                if (next instanceof HTMLButtonElement) {
                    next.click();
                } else {
                    next.focus();
                }
            }
        }
    };

    const handleReset = () => {
        setData({});
        setOpen(false);
    };

    return (
        <div>
            <Button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                size="lg"
            >
                <TrendingUp size={18} />
                Yangi mahsulot
            </Button>

            <FullPageOverlay open={open} onOpenChange={setOpen}>
                <FullPageOverlay.Content title="Mahsulot yaratish">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full overflow-hidden p-1">
                        {/* Mahsulot nomi */}
                        <label className="w-full flex flex-col space-y-2">
                            <span className="text-sm font-medium">
                                Mahsulot nomi <span className="text-red-500">*</span>
                            </span>
                            <Input
                                ref={el => { inputRefs.current[0] = el }}
                                autoFocus
                                name="name"
                                type="text"
                                className="h-12"
                                placeholder="Masalan: Samsung Galaxy S24"
                                value={data.name || ""}
                                onChange={handleTextChange}
                                onKeyDown={(e) => handleEnter(e, 0)}
                            />
                        </label>

                        {/* Miqdori */}
                        <label className="w-full flex flex-col space-y-2">
                            <span className="text-sm font-medium">
                                Miqdori <span className="text-red-500">*</span>
                            </span>
                            <NumberInput
                                value={data.count || 0}
                                onChange={({ raw }) => handleNumberChange('count', raw)}
                                placeholder="Masalan: 100"
                                className="h-12"
                            />
                            <Input
                                ref={el => { inputRefs.current[1] = el }}
                                type="text"
                                className="sr-only"
                                onKeyDown={(e) => handleEnter(e, 1)}
                            />
                        </label>

                        {/* Eslatma miqdori */}
                        <label className="w-full flex flex-col space-y-2">
                            <span className="text-sm font-medium">Eslatma miqdori</span>
                            <NumberInput
                                value={data.remine_count || 0}
                                onChange={({ raw }) => handleNumberChange('remine_count', raw)}
                                placeholder="Masalan: 10"
                                className="h-12"
                            />
                            <Input
                                ref={el => { inputRefs.current[3] = el }}
                                type="text"
                                className="sr-only"
                                onKeyDown={(e) => handleEnter(e, 2)}
                            />
                        </label>

                        {/* USD Rate (readonly) */}
                        <label className="w-full flex flex-col space-y-2">
                            <span className="text-sm font-medium flex items-center gap-2">
                                <DollarSign size={16} />
                                USD kursi
                            </span>
                            <NumberInput
                                value={usdRate}
                                readonly
                                className="h-12 bg-muted cursor-not-allowed"
                            />
                        </label>

                        {/* Tan narxi UZS */}
                        <label className="w-full flex flex-col space-y-2">
                            <span className="text-sm font-medium">
                                Tan narxi (UZS) <span className="text-red-500">*</span>
                            </span>
                            <NumberInput
                                value={data.tan_narx_uzb || 0}
                                onChange={({ raw }) => handleNumberChange('tan_narx_uzb', raw)}
                                placeholder="Masalan: 5 000 000"
                                className="h-12"
                            />
                            <input
                                ref={el => { inputRefs.current[4] = el }}
                                type="text"
                                className="sr-only"
                                onKeyDown={(e) => handleEnter(e, 3)}
                            />
                        </label>

                        {/* Tan narxi USD (auto-calculated) */}
                        <label className="w-full flex flex-col space-y-2">
                            <span className="text-sm font-medium flex items-center gap-2">
                                Tan narxi ($)
                                <span className="text-xs text-muted-foreground">(Avtomatik)</span>
                            </span>
                            <div className="relative">
                                <Input
                                    type="text"
                                    className="h-12 bg-muted/50 cursor-default"
                                    value={data.tan_narx_dol ? `$ ${data.tan_narx_dol.toFixed(2)}` : '$ 0.00'}
                                    readOnly
                                />
                                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            </div>
                        </label>

                        {/* Sotuv narxi UZS */}
                        <label className="w-full flex flex-col space-y-2">
                            <span className="text-sm font-medium">
                                Sotuv narxi (UZS) <span className="text-red-500">*</span>
                            </span>
                            <NumberInput
                                value={data.saler_narxi || 0}
                                onChange={({ raw }) => handleNumberChange('saler_narxi', raw)}
                                placeholder="Masalan: 6 000 000"
                                className="h-12"
                            />
                            <input
                                ref={el => { inputRefs.current[5] = el }}
                                type="text"
                                className="sr-only"
                                onKeyDown={(e) => handleEnter(e, 4)}
                            />
                        </label>

                        {/* Sotuv narxi USD (auto-calculated) */}
                        <label className="w-full flex flex-col space-y-2">
                            <span className="text-sm font-medium flex items-center gap-2">
                                Sotuv narxi ($)
                                <span className="text-xs text-muted-foreground">(Avtomatik)</span>
                            </span>
                            <div className="relative">
                                <Input
                                    type="text"
                                    className="h-12 bg-muted/50 cursor-default"
                                    value={data.saler_narxi_dol ? `$ ${data.saler_narxi_dol.toFixed(2)}` : '$ 0.00'}
                                    readOnly
                                />
                                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
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
                                    // Focus next element after selection
                                    setTimeout(() => {
                                        const next = inputRefs.current[6];
                                        if (next && next instanceof HTMLButtonElement) {
                                            next.click();
                                        }
                                    }, 100);
                                }}
                            >
                                <SelectTrigger
                                    ref={el => { inputRefs.current[5] = el }}
                                    className="w-full h-12"
                                    onKeyDown={(e) => handleEnter(e, 5)}
                                >
                                    <SelectValue placeholder="Birlik tanlang..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {unitsLoading ? (
                                        <div className="p-2 text-sm text-muted-foreground">Yuklanmoqda...</div>
                                    ) : (
                                        units?.data?.map((el: categoryType) => (
                                            <SelectItem key={el.id} value={el.id}>
                                                {el.name}
                                            </SelectItem>
                                        ))
                                    )}
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
                                    // Focus submit button after selection
                                    setTimeout(() => {
                                        const submitBtn = inputRefs.current[7];
                                        if (submitBtn) {
                                            submitBtn.focus();
                                        }
                                    }, 100);
                                }}
                            >
                                <SelectTrigger
                                    ref={el => { inputRefs.current[6] = el }}
                                    className="w-full h-12"
                                    onKeyDown={(e) => handleEnter(e, 6)}
                                >
                                    <SelectValue placeholder="Kategoriya tanlang..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoriesLoading ? (
                                        <div className="p-2 text-sm text-muted-foreground">Yuklanmoqda...</div>
                                    ) : (
                                        categories?.data?.map((el: categoryType) => (
                                            <SelectItem key={el.id} value={el.id}>
                                                {el.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </label>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Eslatma:</strong> USD narxlari avtomatik hisoblanadi.
                            Joriy kurs: <span className="font-mono">{usdRate.toLocaleString()} so'm</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-6">
                        <Button
                            ref={el => { inputRefs.current[7] = el }}
                            onClick={onHandleSubmit}
                            disabled={createProducts.isPending}
                            size="lg"
                            className="flex-1"
                        >
                            {createProducts.isPending ? 'Yuklanmoqda...' : 'Yaratish'}
                        </Button>
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            size="lg"
                            className="flex-1"
                            disabled={createProducts.isPending}
                        >
                            Bekor qilish
                        </Button>
                    </div>
                </FullPageOverlay.Content>
            </FullPageOverlay>
        </div>
    );
};

export default ProductCreate;
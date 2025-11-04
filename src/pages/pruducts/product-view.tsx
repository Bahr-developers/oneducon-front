import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { product } from "@/types";
import { Eye, Package, Tag, DollarSign, Hash, Layers, Scale, Calendar } from "lucide-react";
import { useState } from "react";

const ProductView = (product: product) => {
    const [open, setOpen] = useState(false);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatCurrency = (amount: number, currency: string = 'UZS') => {
        if (currency === 'UZS') {
            return `${formatNumber(amount)} so'm`;
        }
        return `$${formatNumber(amount)}`;
    };

    const getStatusColor = (quantity: number) => {
        if (quantity > 0) return "text-green-600 bg-green-50 border-green-200";
        if (quantity === 0) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    const getStatusText = (quantity: number) => {
        if (quantity > 0) return "Omborda mavjud";
        if (quantity === 0) return "Qolmagan";
        return "Kam qolgan";
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto scroll-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Package className="h-5 w-5" />
                        Mahsulot ma'lumotlari
                    </DialogTitle>
                    <DialogDescription>
                        Batafsil ma'lumotlarni ko'rib chiqing
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="rounded-lg p-4 border shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold ">{product.name}</h3>
                                <p className="text-sm">ID: {product.id}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(product.quantity)}`}>
                                {getStatusText(product.quantity)}
                            </div>
                        </div>
                    </div>

                    {/* Main Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Quantity Information */}
                        <div className="space-y-3">
                            <h4 className="font-medium  flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Miqdor ma'lumotlari
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 rounded-lg border">
                                    <span className="text-sm">Jami miqdor:</span>
                                    <span className={`font-semibold ${product.quantity < 0 ? 'text-red-600' : ''}`}>
                                        {formatNumber(product.quantity)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg border">
                                    <span className="text-sm">Eslatma miqdori:</span>
                                    <span className="font-semibold ">
                                        {formatNumber(product.reminder_quantity)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Category & Unit */}
                        <div className="space-y-3">
                            <h4 className="font-medium  flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Kategoriya va o'lchov
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 rounded-lg border">
                                    <span className="text-sm">Kategoriya:</span>
                                    <span className="font-semibold ">{product.category.name}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg border">
                                    <span className="text-sm">O'lchov birligi:</span>
                                    <span className="font-semibold  flex items-center gap-1">
                                        <Scale className="h-3 w-3" />
                                        {product.unit.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price Information */}
                    <div className="space-y-3">
                        <h4 className="font-medium  flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Narx ma'lumotlari
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg border border-blue-100">
                                <div className="text-sm text-blue-600">Tan narxi (UZS)</div>
                                <div className="text-lg font-bold text-blue-900">
                                    {formatCurrency(product.cost_price, 'UZS')}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg border border-green-100">
                                <div className="text-sm text-green-600">Tan narxi ($)</div>
                                <div className="text-lg font-bold text-green-900">
                                    {formatCurrency(product.cost_price_usd, 'USD')}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg border border-purple-100">
                                <div className="text-sm text-purple-600">Sotuv narxi ($)</div>
                                <div className="text-lg font-bold text-purple-900">
                                    {formatCurrency(product.sale_price, 'USD')}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg border border-orange-100">
                                <div className="text-sm text-orange-600">USD kursi</div>
                                <div className="text-lg font-bold text-orange-900">
                                    {formatNumber(product.usd_rate)} so'm
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-3">
                        <h4 className="font-medium  flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Qo'shimcha ma'lumotlar
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex gap-x-6 items-center p-3 rounded-lg">
                                <span className="text-sm">Do'kon ID:</span>
                                <span className="font-medium ">#{product.store_id}</span>
                            </div>
                            <div className="flex justify-around items-center p-3 rounded-lg">
                                <span className="text-sm">Yaratilgan:</span>
                                <span className="font-medium flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {product?.created_at ? new Date(product?.created_at).toLocaleDateString() : 'Noma\'lum'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductView;
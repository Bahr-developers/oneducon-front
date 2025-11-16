import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { order } from "@/types";
import {
    Eye,
    Package,
    CreditCard,
    AlertCircle,
    User,
    Phone,
    Calendar,
    ShoppingCart,
    Wallet,
    TrendingUp,
    Hash,
    CheckCircle2,
    XCircle
} from "lucide-react";

const ViewSale = (props: order) => {
    // Calculate totals
    const totalPayments = props.payments?.reduce((sum, p) => sum + (p.price || p.amount || 0), 0) || 0;
    const totalItems = props.order_items?.reduce((sum, item) => sum + (item.count || item.quantity || 0), 0) || 0;
    const remainingDebt = props.total_price - totalPayments;




    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer hover:text-primary transition-colors p-2 rounded-md hover:bg-accent">
                <Eye size={18} className="text-muted-foreground hover:text-primary transition-colors" />
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scroll-hidden" w="w-[650px]">
                {/* Header */}
                <DialogHeader className="space-y-3 mt-5">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ShoppingCart className="h-6 w-6 text-primary" />
                            </div>
                            Buyurtma #{props.order_number || props.id}
                        </DialogTitle>
                        <Badge variant={remainingDebt > 0 ? "destructive" : "default"} className="text-sm px-3 py-1">
                            {remainingDebt > 0 ? "Qarzli" : "To'liq to'langan"}
                        </Badge>
                    </div>
                    {props.created_at && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={16} />
                            <span>{new Date(props.created_at)?.toLocaleString('uz-UZ', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                    )}
                </DialogHeader>

                <Separator className="my-4" />

                <div className="space-y-6">
                    {/* Client Info */}
                    {props.client && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-blue-500 text-white">
                                    <User size={20} />
                                </div>
                                <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                                    Mijoz ma'lumotlari
                                </h3>
                            </div>
                            <div className="space-y-3 ml-11">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-blue-800 dark:text-blue-200">Ism:</span>
                                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                                        {props.client.name}
                                    </span>
                                </div>
                                {props.client.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-blue-600 dark:text-blue-400" />
                                        <span className="text-blue-700 dark:text-blue-300 font-mono">
                                            +{props.client.phone}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-xl p-5 border-2 border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    Jami summa
                                </p>
                            </div>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                {props.total_price?.toLocaleString()} so'm
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet className="text-blue-600 dark:text-blue-400" size={20} />
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    To'langan
                                </p>
                            </div>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                {totalPayments?.toLocaleString()} so'm
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl p-5 border-2 border-orange-200 dark:border-orange-800">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="text-orange-600 dark:text-orange-400" size={20} />
                                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                                    Qolgan qarz
                                </p>
                            </div>
                            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                {remainingDebt?.toLocaleString()} so'm
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    {props.order_items && props.order_items.length > 0 && (
                        <div className="bg-card rounded-xl p-5 border-2">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                                        <Package className="text-purple-600 dark:text-purple-400" size={20} />
                                    </div>
                                    <h3 className="font-semibold text-lg">Mahsulotlar</h3>
                                </div>
                                <Badge variant="secondary" className="text-sm">
                                    {totalItems} ta mahsulot
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                {props.order_items.map((item, index) => {
                                    const quantity = item.count || item.quantity || 0;
                                    const price = item.price || 0;
                                    const discount = item.discount || 0;
                                    const itemTotal = quantity * price * (1 - discount / 100);

                                    return (
                                        <div
                                            key={item.id || index}
                                            className="bg-muted/50 rounded-lg p-4 border hover:border-primary/50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Hash size={16} className="text-muted-foreground" />
                                                        <p className="font-semibold text-base">
                                                            {item.product?.name || item.name || `Mahsulot #${index + 1}`}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                                        <div className="flex flex-col">
                                                            <span className="text-muted-foreground text-xs">Miqdori</span>
                                                            <span className="font-medium">{quantity} ta</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-muted-foreground text-xs">Narxi</span>
                                                            <span className="font-medium">{price?.toLocaleString()} so'm</span>
                                                        </div>
                                                        {discount > 0 && (
                                                            <div className="flex flex-col">
                                                                <span className="text-muted-foreground text-xs">Chegirma</span>
                                                                <span className="font-medium text-red-600 dark:text-red-400">
                                                                    {discount}%
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground mb-1">Jami</p>
                                                    <p className="text-xl font-bold text-primary">
                                                        {itemTotal?.toLocaleString()} so'm
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Payments */}
                    {props.payments && props.payments.length > 0 && (
                        <div className="bg-card rounded-xl p-5 border-2">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                        <CreditCard className="text-blue-600 dark:text-blue-400" size={20} />
                                    </div>
                                    <h3 className="font-semibold text-lg">To'lovlar</h3>
                                </div>
                                <Badge variant="secondary" className="text-sm">
                                    {props.payments.length} ta to'lov
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                {props.payments.map((payment, index) => {
                                    const amount = payment.price || payment.amount || 0;
                                    return (
                                        <div
                                            key={payment.id || index}
                                            className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400" />
                                                        <span className="font-semibold text-blue-900 dark:text-blue-100">
                                                            {payment.payment_type?.name || payment.payment_method || `To'lov #${index + 1}`}
                                                        </span>
                                                    </div>

                                                    {payment.note && (
                                                        <p className="text-sm text-muted-foreground ml-6">
                                                            {payment.note}
                                                        </p>
                                                    )}

                                                    {payment.paid_at && (
                                                        <p className="text-xs text-muted-foreground ml-6 flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {new Date(payment.paid_at)?.toLocaleString('uz-UZ')}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                                        {amount?.toLocaleString()} so'm
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Debts */}
                    {props.debts && props.debts.length > 0 && (
                        <div className="bg-card rounded-xl p-5 border-2 border-orange-200 dark:border-orange-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                                        <AlertCircle className="text-orange-600 dark:text-orange-400" size={20} />
                                    </div>
                                    <h3 className="font-semibold text-lg">Qarzlar</h3>
                                </div>
                                <Badge variant="destructive" className="text-sm">
                                    {props.debts.length} ta qarz
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                {props.debts.map((debt, index) => (
                                    <div
                                        key={debt.id}
                                        className="bg-orange-50 dark:bg-orange-950 rounded-lg p-4 border border-orange-200 dark:border-orange-800"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {debt.status === 'UNPAID' ? (
                                                        <XCircle size={18} className="text-red-600 dark:text-red-400" />
                                                    ) : (
                                                        <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
                                                    )}
                                                    <span className="font-semibold text-orange-900 dark:text-orange-100">
                                                        Qarz #{index + 1}
                                                    </span>
                                                    <Badge
                                                        variant={debt.status === 'UNPAID' ? 'destructive' : 'default'}
                                                        className="text-xs"
                                                    >
                                                        {debt.status === 'UNPAID' ? 'To\'lanmagan' : 'To\'langan'}
                                                    </Badge>
                                                </div>

                                                {debt.reminder && (
                                                    <div className="ml-6 bg-orange-100 dark:bg-orange-900/50 rounded p-2">
                                                        <p className="text-sm text-orange-800 dark:text-orange-200">
                                                            <span className="font-medium">Eslatma:</span> {debt.reminder}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-right">
                                                <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                                                    {debt.price?.toLocaleString()} so'm
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Summary Footer */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5 border-2 border-primary/20">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Yakuniy hisob:</span>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                    {totalPayments?.toLocaleString()} / {props.total_price?.toLocaleString()} so'm
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                    {remainingDebt > 0
                                        ? `Qoldi: ${remainingDebt?.toLocaleString()} so'm`
                                        : 'To\'liq to\'langan ✓'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewSale;
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { order } from "@/types";
import { Eye, Package, CreditCard, AlertCircle, User, Phone, Calendar } from "lucide-react";

const ViewSale = (props: order) => {

    // Calculate totals
    const totalPayments = props.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const totalDebts = props.debts?.reduce((sum, d) => sum + d.price, 0) || 0;
    const totalItems = props.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer hover:text-blue-600 transition-colors">
                <Eye size={20} />
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Buyurtma {props.order_number ? `#${props.order_number}` : `#${props.id}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Client Info */}
                    {props.client && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="text-blue-600" size={20} />
                                <h3 className="font-semibold text-lg text-blue-900">Mijoz ma'lumotlari</h3>
                            </div>
                            <div className="space-y-2 ml-7">
                                <p className="text-gray-700">
                                    <span className="font-medium">Ism:</span> {props.client.name}
                                </p>
                                {props.client.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-600" />
                                        <span className="text-gray-700">{props.client.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-sm text-green-600 font-medium mb-1">Jami summa</p>
                            <p className="text-2xl font-bold text-green-700">
                                {props.total_price.toLocaleString()} so'm
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm text-blue-600 font-medium mb-1">To'langan</p>
                            <p className="text-2xl font-bold text-blue-700">
                                {totalPayments.toLocaleString()} so'm
                            </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <p className="text-sm text-orange-600 font-medium mb-1">Qarz</p>
                            <p className="text-2xl font-bold text-orange-700">
                                {totalDebts.toLocaleString()} so'm
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    {props.order_items && props.order_items.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="text-gray-700" size={20} />
                                <h3 className="font-semibold text-lg text-gray-900">
                                    Mahsulotlar ({totalItems} ta)
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {props.order_items.map((item, index) => (
                                    <div key={item.id || index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {item.name || `Mahsulot #${index + 1}`}
                                                </p>
                                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                                    {item.quantity && (
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">Soni:</span> {item.quantity} ta
                                                        </p>
                                                    )}
                                                    {item.price && (
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">Narxi:</span> {item.price.toLocaleString()} so'm
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {item.total && (
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {item.total.toLocaleString()} so'm
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payments */}
                    {props.payments && props.payments.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="text-blue-700" size={20} />
                                <h3 className="font-semibold text-lg text-blue-900">
                                    To'lovlar ({props.payments.length} ta)
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {props.payments.map((payment, index) => (
                                    <div key={payment.id || index} className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <span className="text-gray-700 font-medium">
                                                    {payment.payment_method || `To'lov #${index + 1}`}
                                                </span>
                                                {payment.note && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {payment.note}
                                                    </p>
                                                )}
                                                {payment.paid_at && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(payment.paid_at).toLocaleString('uz-UZ')}
                                                    </p>
                                                )}
                                            </div>
                                            {payment.amount && (
                                                <span className="text-lg font-bold text-blue-700">
                                                    {payment.amount.toLocaleString()} so'm
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Debts */}
                    {props.debts && props.debts.length > 0 && (
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-orange-700" size={20} />
                                <h3 className="font-semibold text-lg text-orange-900">
                                    Qarzlar ({props.debts.length} ta)
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {props.debts.map((debt, index) => (
                                    <div key={debt.id} className="bg-white rounded-lg p-3 shadow-sm border border-orange-100">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-gray-700 font-medium">
                                                        Qarz #{index + 1}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${debt.status === 'UNPAID'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {debt.status === 'UNPAID' ? 'To\'lanmagan' : 'To\'langan'}
                                                    </span>
                                                </div>
                                                {debt.reminder && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        <span className="font-medium">Eslatma:</span> {debt.reminder}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-lg font-bold text-orange-700">
                                                {debt.price.toLocaleString()} so'm
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Created At */}
                    {props.created_at && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 justify-center pt-2 border-t">
                            <Calendar size={16} />
                            <span>Yaratilgan: {new Date(props.created_at).toLocaleString('uz-UZ')}</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewSale;
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import NumberInput from "@/components/_components/number-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePayment, removePayment, selectTotals, selectPayments } from "@/store/order-slice";
import { useEffect, useRef } from "react";

interface PaymentType {
    id: string;
    name: string;
}

interface PaymentItemProps {
    index: number;
    payment: {
        payment_type_id: string;
        price: number;
    };
    paymentTypes?: PaymentType[];
}

const PaymentItem = ({ index, payment, paymentTypes }: PaymentItemProps) => {
    const dispatch = useAppDispatch();
    const totals = useAppSelector(selectTotals);
    const payments = useAppSelector(selectPayments);
    const inputRef = useRef<HTMLInputElement>(null);
    const { totalItemsAmount } = totals;

    // To'lov turi tanlaganda automatic summa to'ldirish
    useEffect(() => {
        if (payment.payment_type_id && payment.price === 0) {
            // Oldingi to'lovlar yig'indisini hisoblash
            const previousPayments = payments
                .slice(0, index)
                .reduce((sum, p) => sum + Number(p.price || 0), 0);

            // Qolgan summani hisoblash
            const remainingAmount = Math.max(0, totalItemsAmount - previousPayments);

            dispatch(updatePayment({
                index,
                payment: { ...payment, price: remainingAmount },
            }));
        }
    }, [dispatch, index, payment, payment.payment_type_id, payments, totalItemsAmount]);

    const handleSelectType = (typeId: string) => {
        dispatch(updatePayment({
            index,
            payment: { ...payment, payment_type_id: typeId },
        }));
    };

    const handlePriceChange = (val: { raw: number }) => {
        // Boshqa to'lovlar yig'indisini hisoblash (joriy to'lovdan tashqari)
        const otherPaymentsTotal = payments
            .filter((_, i) => i !== index)
            .reduce((sum, p) => sum + Number(p.price || 0), 0);

        // Joriy to'lov uchun maksimal ruxsat etilgan summa
        const maxAllowedPrice = Math.max(0, totalItemsAmount - otherPaymentsTotal);

        // Kiritilgan summani cheklash
        const newPrice = Math.min(val.raw, maxAllowedPrice);

        dispatch(updatePayment({
            index,
            payment: { ...payment, price: newPrice },
        }));
    };

    const handleRemove = () => {
        dispatch(removePayment(index));
    };

    // Focus bo'lganda barcha raqamlarni select qilish
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    return (
        <div className="w-full border rounded-lg p-3 gap-3 bg-[#f0f0f0] dark:bg-[#2d2d2d] items-center">
            <div className="w-full flex justify-end py-2 border-b">
                <Button className="cursor-pointer" variant="destructive" onClick={handleRemove}>
                    <Trash2 />
                </Button>
            </div>

            <div className="w-full flex gap-x-5">
                <label>
                    <span className="my-1 block">To'lov turi *</span>
                    <Select
                        value={payment.payment_type_id || ""}
                        onValueChange={handleSelectType}
                    >
                        <SelectTrigger className="w-[450px]">
                            <SelectValue placeholder="To'lov turini tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentTypes?.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </label>

                <label className="w-60">
                    <span className="my-1 block">Summasi *</span>
                    <NumberInput
                        ref={inputRef}
                        value={payment.price}
                        onChange={handlePriceChange}
                        placeholder="0"
                        className="w-full h-12"
                        onFocus={handleFocus}
                    />
                </label>
            </div>
        </div>
    );
};

export default PaymentItem;
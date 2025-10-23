import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import NumberInput from "@/components/_components/number-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch } from "@/store/hooks";
import { updatePayment, removePayment } from "@/store/order-slice";

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

    const handleSelectType = (typeId: string) => {
        dispatch(updatePayment({
            index,
            payment: { ...payment, payment_type_id: typeId },
        }));
    };

    const handlePriceChange = (val: { raw: number }) => {
        dispatch(updatePayment({
            index,
            payment: { ...payment, price: val.raw },
        }));
    };

    const handleRemove = () => {
        dispatch(removePayment(index));
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
                        value={payment.price}
                        onChange={handlePriceChange}
                        placeholder="0"
                        className="w-full h-12"
                    />
                </label>
            </div>
        </div>
    );
};

export default PaymentItem;
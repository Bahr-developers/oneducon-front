import { Button } from '@/components/ui/button';
import OrderItem from './order-item';
import PaymentItem from './payment-item';
import DebtsItem from './debts-item';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    addOrderItem,
    addPayment,
    selectOrderItems,
    selectPayments,
    selectTotals,
    selectDebt,
    resetOrder,
} from '@/store/order-slice';
import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentUtils } from '@/utils/payment-type';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { orderUtils } from '@/utils/orders';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { user } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

export default function OrderProducts() {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectOrderItems);
    const payments = useAppSelector(selectPayments);
    const { hasDebt, remainingDebt } = useAppSelector(selectTotals);
    const debt = useAppSelector(selectDebt);
    const [returnTime, setReturnTime] = useState<Date | undefined>();
    const [selectedUser, setSelectedUser] = useState<user | null>(null);
    const [isChecked, setIsChecked] = useState(false)
    const [reminder, setReminder] = useState("");
    const { data: paymentTypes } = useQuery({
        queryKey: ['get_payment'],
        queryFn: paymentUtils.getPayments,
    });

    const handleAddItem = () => {
        dispatch(addOrderItem());
    };

    const handleAddPayment = () => {
        dispatch(addPayment());
    };

    const createOrder = useMutation({
        mutationFn: orderUtils.postOrder,
        onSuccess: () => {
            toast.success('Order yaratildi ')
            dispatch(resetOrder());
            setSelectedUser(null)
            setReturnTime(undefined)
            setReminder('')

        },
        onError: (err) => {
            const error = err as AxiosError<{ messages: string }>
            toast.error(error.response?.data.messages || 'Something went wrong')
        }
    })

    const handleSubmit = () => {
        const orderData = {
            store_id: 1,
            client_id: 1,
            items: items
                .filter((item) => item.product !== null)
                .map((item) => ({
                    product_id: item.product_id,
                    count: item.count,
                    discount: Number(item.discount),
                    price: item.price,
                })),
            payments: payments
                .filter((p) => p?.payment_type_id && p?.price > 0)
                .map((p) => ({
                    ...p,
                    payment_type_id: Number(p.payment_type_id),
                })),
            debts: debt ? [debt] : [],
        };

        console.log("Yuborilayotgan ma'lumotlar:", orderData);

        createOrder.mutate(orderData);
    };

    const handleReset = () => {
        dispatch(resetOrder());
        setSelectedUser(null)
        setReturnTime(undefined)
        setReminder('')
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Buyurtma berish</h2>
                <Button variant="outline" onClick={handleReset}>
                    Tozalash
                </Button>
            </div>

            {/* PRODUCTS SECTION */}
            <Accordion
                type="single"
                collapsible
                defaultValue="products"
                className="w-full px-5 my-5 rounded-lg border p-3 "
            >
                <AccordionItem className="w-full" value="products">
                    <AccordionTrigger className="text-xl">
                        Mahsulotlar
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col space-y-5 pt-0">
                        {items?.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">
                                Mahsulot qo'shilmagan
                            </p>
                        ) : (
                            items.map((item) => (
                                <OrderItem key={item.id} item={item} constPrice={isChecked} />
                            ))
                        )}
                        <Button
                            className="w-[200px] mx-auto border"
                            variant="secondary"
                            onClick={handleAddItem}
                        >
                            + Mahsulot qo'shish
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {items?.length ? <label
                    className="text-sm font-medium leading-none flex items-center gap-x-2 justify-end"
                >
                    <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => setIsChecked(checked === true)}
                    />
                    <span> Tan narxi</span>
                </label> : ''}
            </Accordion>

            {/* PAYMENTS SECTION */}
            <div className="flex flex-col gap-4 p-5 border rounded-lg mb-5">
                <h3 className="text-xl font-semibold">To'lovlar</h3>
                {payments?.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                        To'lov qo'shilmagan
                    </p>
                ) : (
                    payments?.map((payment, index) => (
                        <PaymentItem
                            key={index}
                            index={index}
                            payment={payment}
                            paymentTypes={paymentTypes?.data}
                        />
                    ))
                )}

                <Button
                    variant="secondary"
                    onClick={handleAddPayment}
                    className="mx-auto border w-[200px] my-3"
                >
                    + To'lov qo'shish
                </Button>
            </div>

            {/* DEBT SECTION */}
            <div className="p-5 border rounded-lg mb-5">
                <h3 className="text-xl font-semibold mb-4">Hisob-kitob</h3>
                <DebtsItem
                    open={hasDebt}
                    returnTime={returnTime}
                    setReturnTime={setReturnTime}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    reminder={reminder}
                    setReminder={setReminder}
                />

                {hasDebt && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            ⚠️ Diqqat: {remainingDebt.toLocaleString()} UZS qarz qolmoqda.
                            Qaytarish vaqtini belgilashni unutmang!
                        </p>
                    </div>
                )}
            </div>

            {/* SUBMIT BUTTON */}
            <Button
                onClick={handleSubmit}
                className="w-[200px] mx-auto block"
                disabled={
                    items?.length === 0 ||
                    items.every(i => !i.product) ||
                    (hasDebt && (!selectedUser || !returnTime))
                }
            >
                Buyurtmani saqlash
            </Button>
        </div>
    );
}
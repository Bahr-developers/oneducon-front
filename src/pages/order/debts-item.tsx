import NumberInput from "@/components/_components/number-input";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTotals, setDebt } from "@/store/order-slice";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/functions/date-picer";
import { useQuery } from "@tanstack/react-query";
import { customerUtils } from "@/utils/customer";
import UniversalSearchSelect from "@/components/_components/search-select";
import { user } from "@/types";
import CreateCustomer from "../customers/create-cus";

// DebtsItem.tsx
interface DebtModalProps {
    open: boolean;
    returnTime: Date | undefined;
    setReturnTime: (date: Date | undefined) => void;
    selectedUser: user | null;
    setSelectedUser: (user: user | null) => void;
}


const DebtsItem = ({ open, returnTime, setReturnTime, selectedUser, setSelectedUser }: DebtModalProps) => {
    const dispatch = useAppDispatch();
    const totals = useAppSelector(selectTotals);
    const { i18n } = useTranslation()
    const { totalItemsAmount, totalPaidAmount, remainingDebt } = totals;

    const [reminder, setReminder] = useState("");
    const updateDebt = useCallback(() => {
        if (open && remainingDebt > 0) {
            dispatch(setDebt({
                price: remainingDebt,
                return_time: returnTime?.toISOString() || '',
                reminder: reminder,
                client_id: Number(selectedUser?.id),
            }));
        }
    }, [dispatch, open, remainingDebt, returnTime, reminder, selectedUser]);

    useEffect(() => {
        updateDebt();
    }, [updateDebt]);

    const handleReminderChange = (value: string) => {
        setReminder(value);
    };
    const { data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: customerUtils.getCustomer
    })


    return (
        <div className="flex flex-col space-y-3 w-full">
            <label className="w-full">
                <span className="my-1 block text-sm">Umumiy xarid narxi UZS</span>
                <div className="h-12 w-full relative rounded-lg overflow-hidden">
                    <NumberInput
                        value={totalItemsAmount}
                        placeholder="0"
                        className="w-full h-full"
                        readonly={true}
                    />
                    <span className="absolute h-full p-2 px-4 bg-[#a2a1a1] text-white right-0 bottom-0 text-center flex items-center justify-center">
                        UZS
                    </span>
                </div>
            </label>

            <label className="w-full">
                <span className="my-1 block text-sm">To'langan summa UZS</span>
                <div className="h-12 w-full relative rounded-lg overflow-hidden">
                    <NumberInput
                        value={totalPaidAmount}
                        placeholder="0"
                        className="w-full h-full"
                        readonly={true}
                    />
                    <span className="absolute h-full p-2 px-4 bg-[#a2a1a1] text-white right-0 bottom-0 text-center flex items-center justify-center">
                        UZS
                    </span>
                </div>
            </label>

            {open && remainingDebt > 0 && (
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        Qarz: {remainingDebt.toLocaleString()} UZS
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center gap-x-3">
                            <UniversalSearchSelect
                                data={customers?.data}
                                searchKey="name"
                                displayKey="name"
                                value={selectedUser}
                                onSelect={setSelectedUser}
                                placeholder="User nomini kiriting..."
                                className="w-[80%]"
                            />
                            <CreateCustomer title="" />
                        </div>

                        <DatePicker
                            className="text-start my-1 text-sm"
                            date={returnTime}
                            setDate={setReturnTime}
                            title={i18n.language == 'uz' ? 'Qaytarish vaqti *' : 'от'}
                            startTitle={i18n.language == 'uz' ? 'Qaytarish vaqti' : 'Дата начала'}
                        />

                        <label className="block">
                            <span className="block mb-1 text-sm">Eslatma (ixtiyoriy)</span>
                            <Input
                                placeholder="Eslatma yozing..."
                                value={reminder}
                                onChange={(e) => handleReminderChange(e.target.value)}
                                className="w-full h-12"
                            />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebtsItem;
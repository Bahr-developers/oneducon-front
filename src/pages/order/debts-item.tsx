import NumberInput from "@/components/_components/number-input";
import { Input } from "@/components/ui/input";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTotals, setDebt } from "@/store/order-slice";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/functions/date-picer";
import { useQuery } from "@tanstack/react-query";
import { customerUtils } from "@/utils/customer";
import UniversalSearchSelect from "@/components/_components/search-select";
import { client } from "@/types";
import CreateCustomer from "../customers/create-cus";

// DebtsItem.tsx
interface DebtModalProps {
    open: boolean;
    returnTime: Date | undefined;
    setReturnTime: (date: Date | undefined) => void;
    selectedUser: client | null;
    setSelectedUser: (user: client | null) => void;
    reminder: string
    setReminder: (value: string) => void
}

const DebtsItem = ({ open, returnTime, setReturnTime, selectedUser, setSelectedUser, setReminder, reminder }: DebtModalProps) => {
    const dispatch = useAppDispatch();
    const totals = useAppSelector(selectTotals);
    const { i18n } = useTranslation()
    const { totalItemsAmount, totalPaidAmount, remainingDebt } = totals;

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

    // totalItemsAmount, totalPaidAmount, remainingDebt o'zgarganda qarzni yangilash
    useEffect(() => {
        updateDebt();
    }, [updateDebt, totalItemsAmount, totalPaidAmount, remainingDebt]);

    const handleReminderChange = (value: string) => {
        setReminder(value);
    };

    const { data: customers } = useQuery<{ data: client[] }>({
        queryKey: ['customers'],
        queryFn: customerUtils.getCustomerAll
    })

    return (
        <div className="flex flex-col space-y-4 w-full">
            {/* Total Items Amount */}
            <label className="w-full">
                <span className="my-1 block text-sm font-medium text-foreground">
                    Umumiy xarid narxi UZS
                </span>
                <div className="h-12 w-full relative rounded-md overflow-hidden border border-input bg-background">
                    <NumberInput
                        value={totalItemsAmount}
                        placeholder="0"
                        className="w-full h-full px-3 bg-background text-foreground"
                        readonly={true}
                    />
                    <span className="absolute h-full px-3 bg-muted text-muted-foreground right-0 bottom-0 text-center flex items-center justify-center border-l border-input">
                        UZS
                    </span>
                </div>
            </label>

            {/* Total Paid Amount */}
            <label className="w-full">
                <span className="my-1 block text-sm font-medium text-foreground">
                    To'langan summa UZS
                </span>
                <div className="h-12 w-full relative rounded-md overflow-hidden border border-input bg-background">
                    <NumberInput
                        value={totalPaidAmount}
                        placeholder="0"
                        className="w-full h-full px-3 bg-background text-foreground"
                        readonly={true}
                    />
                    <span className="absolute h-full px-3 bg-muted text-muted-foreground right-0 bottom-0 text-center flex items-center justify-center border-l border-input">
                        UZS
                    </span>
                </div>
            </label>

            {/* Debt Section */}
            {open && remainingDebt > 0 && (
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5 dark:bg-destructive/10">
                    <h3 className="text-lg font-semibold mb-3 text-destructive dark:text-destructive-foreground">
                        Qarz: {remainingDebt?.toLocaleString()} UZS
                    </h3>

                    <div className="space-y-4">
                        {/* Customer Selection */}
                        <div className="flex justify-between items-center gap-x-3">
                            <UniversalSearchSelect
                                data={customers?.data || []}
                                searchKey={["name", "phone"]}
                                displayKey="name"
                                secondaryKey='phone'
                                value={selectedUser}
                                onSelect={setSelectedUser}
                                placeholder="User nomini kiriting..."
                                className="w-[80%]"
                            />
                            <CreateCustomer />
                        </div>

                        {/* Date Picker */}
                        <DatePicker
                            className="text-start my-1 text-sm"
                            date={returnTime}
                            setDate={setReturnTime}
                            title={i18n.language == 'uz' ? 'Qaytarish vaqti *' : 'от'}
                            startTitle={i18n.language == 'uz' ? 'Qaytarish vaqti' : 'Дата начала'}
                        />

                        {/* Reminder Input */}
                        <label className="block">
                            <span className="block mb-2 text-sm font-medium text-foreground">
                                Eslatma (ixtiyoriy)
                            </span>
                            <Input
                                placeholder="Eslatma yozing..."
                                value={reminder}
                                onChange={(e) => handleReminderChange(e.target.value)}
                                className="w-full h-12 bg-background text-foreground border-input"
                            />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebtsItem;
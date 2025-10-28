import UniversalSearchSelect from "@/components/_components/search-select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAppSelector } from "@/store/hooks";
import { selectTotals } from "@/store/order-slice";
import { Pencil } from "lucide-react";
import CreateCustomer from "../customers/create-cus";
import { DatePicker } from "@/components/functions/date-picer";
import { Input } from "@/components/ui/input";
import { customerUtils } from "@/utils/customer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { user } from "@/types";
import { useTranslation } from "react-i18next";

const EditDepts = () => {
    const totals = useAppSelector(selectTotals);
    const { remainingDebt } = totals;
    const [reminder, setReminder] = useState("");
    const [selectedUser, setSelectedUser] = useState<user | null>(null);
    const handleReminderChange = (value: string) => {
        setReminder(value);
    };
    const { data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: customerUtils.getCustomer
    })
    const [returnTime, setReturnTime] = useState<Date | undefined>();
    const { i18n } = useTranslation()

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer">
                <Pencil size={20} /></DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter</DialogTitle>
                    <DialogDescription>
                        Filter data by usernamde, category and date
                    </DialogDescription>
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
                                <CreateCustomer />
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
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default EditDepts;
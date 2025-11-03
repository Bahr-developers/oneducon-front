import UniversalSearchSelect from "@/components/_components/search-select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react";
import CreateCustomer from "../customers/create-cus";
import { DatePicker } from "@/components/functions/date-picer";
import { Input } from "@/components/ui/input";
import { customerUtils } from "@/utils/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { client, debt } from "@/types";
import { useTranslation } from "react-i18next";
import { debtsUtils } from "@/utils/debts";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import NumberInput from "@/components/_components/number-input";

const EditDepts = (data: debt) => {
    const [reminder, setReminder] = useState(data?.reminder);
    const [price, setPrice] = useState<string | number>(data.price)
    const [selectedUser, setSelectedUser] = useState<client>(data.client);
    const handleReminderChange = (value: string) => {
        setReminder(value);
    };
    const queryClient = useQueryClient()
    const { data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: customerUtils.getCustomer
    })
    const [returnTime, setReturnTime] = useState<Date | undefined>();
    const { i18n } = useTranslation()

    const editMutation = useMutation({
        mutationFn: debtsUtils.editDebts,
        onSuccess: () => {
            toast.success('Tahrirlandi ')
            queryClient.invalidateQueries({
                queryKey: ['customers']
            })
        },
        onError: () => {
            toast.error('Xatolik mavjud')
        }
    })

    const handelEdit = () => {
        editMutation.mutate({
            client_id: +selectedUser.id,
            id: data.id,
            price: +price,
            reminder: reminder,
            return_time: returnTime
        })
    }

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer">
                <Pencil size={20} /></DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter</DialogTitle>
                    <DialogDescription>
                        Qarzdorlarni ma'lumotlarini tahrirlash
                    </DialogDescription>

                    <div className="space-y-3">
                        <label className="w-full">
                            <span className="my-1 block text-sm">Umumiy qarz (UZS)</span>
                            <div className="h-12 w-full relative rounded-lg overflow-hidden">
                                <NumberInput
                                    value={+price}
                                    placeholder="0"
                                    className="w-full h-full"
                                    onChange={val => setPrice(val.raw)}
                                />
                                <span className="absolute h-full p-2 px-4 bg-[#a2a1a1] text-white right-0 bottom-0 text-center flex items-center justify-center">
                                    UZS
                                </span>
                            </div>
                        </label>
                        <div className="w-full  mt-2">
                            <span>Mijoz</span>
                            <div className="w-full flex justify-between items-center gap-x-3">
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
                    <Button onClick={handelEdit} className="cursor-pointer h-10 mt-5">Sqalash</Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default EditDepts;
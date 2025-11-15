import { DatePicker } from "@/components/functions/date-picer";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { client, paymentType } from "@/types";
import { customerUtils } from "@/utils/customer";
import { paymentUtils } from "@/utils/payment-type";
import { useQuery } from "@tanstack/react-query";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";


const FilterData = () => {
    const { i18n } = useTranslation()
    const [from, setFrom] = useState<Date | undefined>()
    const [to, setTo] = useState<Date | undefined>()
    const { data: customers } = useQuery<{ data: client[] }>({
        queryKey: ['customers'],
        queryFn: customerUtils.getCustomerAll
    })
    const { data: paymentTypes } = useQuery<{ data: paymentType[] }>({
        queryKey: ['get_payment'],
        queryFn: paymentUtils.getPayments,
    });

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer">  Filter
                <ListFilter size={20} /></DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter</DialogTitle>
                    <DialogDescription>
                        Ma'lumotlarni filterlar xaridor,to'lov turi va vaqt bo'yicha
                    </DialogDescription>
                    <div className="w-full flex flex-col items-end">
                        <div className="flex items-center w-full justify-between gap-x-2">
                            <label className="w-full">
                                <span>Xaridor</span>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Xaridor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers?.data?.map((client => (
                                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                        )))}
                                    </SelectContent>
                                </Select>
                            </label>
                            <label className="w-full">
                                <span>To'lov turi</span>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="To'lov turi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentTypes?.data?.map((client => (
                                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                        )))}
                                    </SelectContent>
                                </Select>
                            </label>
                        </div>
                        <div className="flex items-center gap-2 my-3 w-full">
                            <DatePicker date={from} setDate={setFrom} title={i18n.language == 'uz' ? 'dan' : 'от'} startTitle={i18n.language == 'uz' ? 'Boshlang`ich sana' : 'Дата начала'} />
                            <DatePicker date={to} setDate={setTo} title={i18n.language == 'uz' ? 'gacha' : 'до'} startTitle={i18n.language == 'uz' ? 'Tugash sanasi' : 'Дата окончания'} />
                        </div>
                        <Button className="justify-end">Filterlash</Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default FilterData;
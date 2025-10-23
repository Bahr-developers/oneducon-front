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
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";


const FilterData = () => {
    const { i18n } = useTranslation()
    const [from, setFrom] = useState<Date | undefined>()
    const [to, setTo] = useState<Date | undefined>()

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer">  Filter
                <ListFilter size={20} /></DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter</DialogTitle>
                    <DialogDescription>
                        Filter data by usernamde, category and date
                    </DialogDescription>
                    <div className="w-full flex flex-col items-end">
                        <div className="flex items-center w-full justify-between gap-x-2">
                            <label className="w-full">
                                <span>Xaridor</span>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </label>
                            <label className="w-full">
                                <span>To'lov turi</span>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
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
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
import { ListFilter } from "lucide-react";
import { useTranslation } from "react-i18next";


interface filterExperens {
    to: Date | undefined,
    from: Date | undefined,
    setFrom: (value: Date | undefined) => void,
    setTo: (value: Date | undefined) => void
}


const FilterExpenses = ({ from, to, setFrom, setTo }: filterExperens) => {
    const { i18n } = useTranslation()


    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer border p-2 rounded-sm px-3">  Filter
                <ListFilter size={20} /></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter</DialogTitle>
                    <DialogDescription>
                        Ma'lumotlarni filterlar xaridor,to'lov turi va vaqt bo'yicha
                    </DialogDescription>
                    <div className="flex items-center gap-2 my-3 w-full">
                        <DatePicker date={from} setDate={setFrom} title={i18n.language == 'uz' ? 'dan' : 'от'} startTitle={i18n.language == 'uz' ? 'Boshlang`ich sana' : 'Дата начала'} />
                        <DatePicker date={to} setDate={setTo} title={i18n.language == 'uz' ? 'gacha' : 'до'} startTitle={i18n.language == 'uz' ? 'Tugash sanasi' : 'Дата окончания'} />
                    </div>
                    <Button className="justify-center">Filterlash</Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default FilterExpenses;
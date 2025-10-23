import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react";
const EditDepts = () => {
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

                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default EditDepts;
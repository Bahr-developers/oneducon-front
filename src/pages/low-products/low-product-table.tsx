import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Pencil, Send } from "lucide-react";
import { Input } from "@/components/ui/input";


const LowProductTable = () => {
    return (
        <div className="p-2 mt-4">
            <div className="flex my-4 justify-between">
                <Input type="search" placeholder="Qidirish..." className="h-12 w-[450px]" />
                <Select>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Kategoriya" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Table className="overflow-hidden rounded-xl">
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[120px]">Qarzdor ismi</TableHead>
                        <TableHead>Qarzdor telefoni</TableHead>
                        <TableHead>Narxi</TableHead>
                        <TableHead>Sana</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">#225</TableCell>
                        <TableCell>Aliyev Joraqul</TableCell>
                        <TableCell>25 000</TableCell>
                        <TableCell>12.05.2025</TableCell>
                        <TableCell className="text-right flex gap-x-5 justify-center items-center">
                            <Pencil />
                            <div className="flex gap-2 items-center">
                                Xabar yuborish
                                <Send size={20} />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">#225</TableCell>
                        <TableCell>Malikov Sabriddin</TableCell>
                        <TableCell>25 000</TableCell>
                        <TableCell>12.05.2025</TableCell>
                        <TableCell className="text-right flex gap-x-5 justify-center items-center">
                            <Pencil />
                            <div className="flex gap-1 items-center">
                                Xabar yuborish
                                <Send />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">#225</TableCell>
                        <TableCell>Malikov Sabriddin</TableCell>
                        <TableCell>25 000</TableCell>
                        <TableCell>12.05.2025</TableCell>
                        <TableCell className="text-right flex gap-x-5 justify-center items-center">
                            <Pencil />
                            <div className="flex gap-1 items-center">
                                Xabar yuborish
                                <Send />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">#225</TableCell>
                        <TableCell>Malikov Sabriddin</TableCell>
                        <TableCell>25 000</TableCell>
                        <TableCell>12.05.2025</TableCell>
                        <TableCell className="text-right flex gap-x-5 justify-center items-center">
                            <Pencil />
                            <div className="flex gap-1 items-center">
                                Xabar yuborish
                                <Send />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">#225</TableCell>
                        <TableCell>Malikov Sabriddin</TableCell>
                        <TableCell>25 000</TableCell>
                        <TableCell>12.05.2025</TableCell>
                        <TableCell className="text-right flex gap-x-5 justify-center items-center">
                            <Pencil />
                            <div className="flex gap-1 items-center">
                                Xabar yuborish
                                <Send />
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default LowProductTable;
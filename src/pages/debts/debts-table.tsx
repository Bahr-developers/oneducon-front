import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Send } from "lucide-react";
import EditDepts from "./edit-dabts";
import { useQuery } from "@tanstack/react-query";
import { debtsUtils } from "@/utils/debts";
import { debt } from "@/types";
import { Button } from "@/components/ui/button";

const DebtsTableSkeleton = () => {
    return (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-x-3 justify-center items-center">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-9 w-32 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

const DebtsTable = () => {
    const { data: debts, isLoading } = useQuery({
        queryKey: ['debts_all'],
        queryFn: debtsUtils.getDebts
    })

    return (
        <div className="mt-5">
            <div className="border rounded-xl overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b">
                            <TableHead className="w-[120px] font-semibold">Buyurtma</TableHead>
                            <TableHead className="font-semibold">Mijoz ID</TableHead>
                            <TableHead className="font-semibold">Narxi</TableHead>
                            <TableHead className="font-semibold">Eslatma</TableHead>
                            <TableHead className="text-right font-semibold">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <DebtsTableSkeleton />
                    ) : debts?.data?.length > 0 ? (
                        <TableBody>
                            {debts?.data.map((el: debt) => (
                                <TableRow
                                    key={el.id}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell className="font-medium">
                                        #{el.order_id}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {el.client_id}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {el.price?.toLocaleString()} so'm
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {el.reminder}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-x-3 justify-center items-center">
                                            <EditDepts />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                            >
                                                Xabar yuborish
                                                <Send size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Qarzlar topilmadi
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </div>
        </div>
    );
};

export default DebtsTable;
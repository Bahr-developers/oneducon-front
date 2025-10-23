import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Eye, HandCoins, Search } from "lucide-react";
import FilterData from "./filter-data";
import { useQuery } from "@tanstack/react-query";
import { orderUtils } from "@/utils/orders";
import { order } from "@/types";

const SalesTableSkeleton = () => {
    return (
        <TableBody>
            {[...Array(6)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-x-3 justify-center items-center">
                            <Skeleton className="h-9 w-9 rounded" />
                            <Skeleton className="h-9 w-24 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

const SalesTable = () => {
    const { data: sales, isLoading } = useQuery<{ data: order[] }>({
        queryKey: ['get_all_orders'],
        queryFn: orderUtils.getOrders
    })

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[300px] max-w-[450px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Qidirish..."
                        className="pl-10 h-11 bg-background"
                    />
                </div>
                <FilterData />
            </div>

            <div className="border rounded-xl overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b">
                            <TableHead className="w-[100px] font-semibold">№</TableHead>
                            <TableHead className="font-semibold">Xaridor</TableHead>
                            <TableHead className="font-semibold">Narxi</TableHead>
                            <TableHead className="font-semibold">Sana</TableHead>
                            <TableHead className="text-right font-semibold">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <SalesTableSkeleton />
                    ) : (sales?.data?.length ?? 0) > 0 ? (
                        <TableBody>
                            {sales?.data.map((el) => (
                                <TableRow
                                    key={el.id}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell className="font-medium">
                                        #{el.id}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {el.client?.name || 'Noma\'lum'}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                            {el.total_price?.toLocaleString()} so'm
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {el.created_at ? new Date(el.created_at).toLocaleDateString('uz-UZ') : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-x-2 justify-center items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                            >
                                                Sotish
                                                <HandCoins className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <HandCoins className="h-12 w-12 mb-2 opacity-50" />
                                        <p className="text-sm">Savdolar topilmadi</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </div>
        </div>
    );
};

export default SalesTable;
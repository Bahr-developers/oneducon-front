import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Send } from "lucide-react";
import EditDepts from "./edit-dabts";
import { useQuery } from "@tanstack/react-query";
import { debtsUtils } from "@/utils/debts";
import { debt } from "@/types";
import { Button } from "@/components/ui/button";
import PaginationContyent from "@/components/_components/pagination";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/components/functions/useDebounce";

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
    const [postsPerPage, setPostsPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState('');

    const debouncedSearch = useDebounce(search)
    const { data: debts, isLoading } = useQuery({
        queryKey: ['debts_all', postsPerPage, currentPage, debouncedSearch],
        queryFn: async () => await debtsUtils.getDebts({ limit: postsPerPage, page: currentPage, search: debouncedSearch })
    })



    const totalPages = Math.max(1, Math.ceil((debts?.total || 1) / postsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [currentPage, totalPages]);

    const paginated = debts?.data

    return (
        <div className="mt-5">
            <div className="relative w-full sm:w-[450px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Qidirish..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-12 pl-10 bg-background"
                />
            </div>
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
                    ) : paginated?.length > 0 ? (
                        <TableBody>
                            {paginated?.map((el: debt) => (
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
            <PaginationContyent
                currentPage={currentPage}
                setPostPerPage={(n) => {
                    setPostsPerPage(n);
                    setCurrentPage(1);
                }}
                postsPerPage={postsPerPage}
                setCurrentPage={(n) => setCurrentPage(n)}
                totalPosts={debts?.total || 0}
            />
        </div>
    );
};

export default DebtsTable;
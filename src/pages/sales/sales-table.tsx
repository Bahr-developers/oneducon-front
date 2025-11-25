import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { HandCoins, Search } from "lucide-react";
import FilterData from "./filter-data";
import { useQuery } from "@tanstack/react-query";
import { orderUtils } from "@/utils/orders";
import { order } from "@/types";
import PaginationContyent from "@/components/_components/pagination";
import { useEffect, useState } from "react";
import ViewSale from "./view-sale";
import { useQueryParams } from "@/components/functions/query-params";
import { useDebounce } from "@/components/functions/useDebounce";
import { Badge } from "@/components/ui/badge";
import SelesTableSkeleton from "./seles-table-skeleton";


const SalesTable = () => {
    const { updateURL, getParam } = useQueryParams();
    const [postsPerPage, setPostsPerPage] = useState<number>(
        () => parseInt(getParam('limit', '5'))
    );
    const [currentPage, setCurrentPage] = useState<number>(
        () => parseInt(getParam('page', '1'))
    );
    const [searchQuery, setSearchQuery] = useState<string>(
        () => getParam('search', '')
    );
    const { data: sales, isLoading } = useQuery<{ data: order[], total: number }>({
        queryKey: ['get_all_orders', currentPage, postsPerPage, searchQuery],
        queryFn: async () => await orderUtils.getOrders({ limit: postsPerPage, page: currentPage, search: searchQuery })
    })

    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        updateURL({
            search: debouncedSearch,
            page: currentPage.toString(),
            limit: postsPerPage.toString(),
        });
    }, [debouncedSearch, currentPage, postsPerPage, updateURL]);

    const totalPages = Math.max(1, Math.ceil((sales?.total || 1) / postsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [currentPage, totalPages]);

    const paginated = sales?.data


    return (
        <div className="mt-10">
            <div className="flex justify-between items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[300px] max-w-[450px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Qidirish..."
                        className="pl-10 h-11 bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                            <TableHead className="font-semibold">Umumiy narxi</TableHead>
                            <TableHead className="font-semibold">To'langan narxi</TableHead>
                            <TableHead className="font-semibold">Qarzdorlik narxi</TableHead>
                            <TableHead className="font-semibold">Mahsulotlar(3)</TableHead>
                            <TableHead className="font-semibold">Yaratilgan sana</TableHead>
                            <TableHead className="text-center font-semibold">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <SelesTableSkeleton />
                    ) : (paginated?.length ?? 0) > 0 ? (
                        <TableBody>
                            {paginated?.map((el) => {
                                const totalPayments = el?.payments?.reduce((sum, p) => sum + (p.price || p.amount || 0), 0) || 0;
                                const remainingDebt = el?.total_price - totalPayments;
                                return (
                                    <TableRow
                                        key={el.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <TableCell className="font-medium">
                                            #{el.order_number}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {el.client?.name || 'Noma\'lum'}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                {el.total_price?.toLocaleString()} so'm
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                {totalPayments?.toLocaleString()} so'm
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-green-600 dark:text-green-400 relative">
                                                {remainingDebt > 0 && remainingDebt?.toLocaleString()} {remainingDebt > 0 && "so'm"}
                                                <Badge variant={remainingDebt > 0 ? "destructive" : "default"} className={`${remainingDebt > 0 ? 'text-[9px] absolute -top-2' : 'text-sm'} `}>
                                                    {remainingDebt > 0 ? "Qarzli" : "To'liq to'langan"}
                                                </Badge>
                                            </div>

                                        </TableCell>
                                        <TableCell>
                                            {el.order_items.slice(0, 3)?.map(item => (
                                                <span className="block" key={item.product.id}>{item.product.name}</span>
                                            ))}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {el.created_at ? new Date(el.created_at).toLocaleDateString('uz-UZ') : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-x-2 justify-center items-center">
                                                <ViewSale {...el} />
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
                                )
                            })}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center">
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
            <PaginationContyent
                currentPage={currentPage}
                setPostPerPage={(n) => {
                    setPostsPerPage(n);
                    setCurrentPage(1);
                }}
                postsPerPage={postsPerPage}
                setCurrentPage={(n) => setCurrentPage(n)}
                totalPosts={sales?.total || 0}
            />
        </div>
    );
};

export default SalesTable;
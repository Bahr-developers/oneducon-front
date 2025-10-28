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
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { productUtils } from "@/utils/products";
import { useEffect, useState } from "react";
import PaginationContyent from "@/components/_components/pagination";
import ProductsTableSkeleton from "../pruducts/product-skeleton";
import { product } from "@/types";
import EditProsucts from "../pruducts/edit-products";
import ProductView from "../pruducts/product-view";


const LowProductTable = () => {
    const [postsPerPage, setPostsPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { data: lowProducts, isLoading } = useQuery({
        queryKey: ['get_all_procusts'],
        queryFn: async () => await productUtils.getProductsLows({ limit: postsPerPage, page: currentPage })
    })
    const totalPages = Math.max(1, Math.ceil((lowProducts?.total || 1) / postsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [currentPage, totalPages]);

    const paginated = lowProducts?.data

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
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b">
                        <TableHead className="w-[60px] font-semibold">№</TableHead>
                        <TableHead className="font-semibold">Nomi</TableHead>
                        <TableHead className="font-semibold">Tan narxi</TableHead>
                        <TableHead className="font-semibold">Sotuv narxi</TableHead>
                        <TableHead className="font-semibold">Miqdori</TableHead>
                        <TableHead className="font-semibold">O'lchov</TableHead>
                        <TableHead className="text-center font-semibold">Amallar</TableHead>
                    </TableRow>
                </TableHeader>
                {isLoading ? (
                    <ProductsTableSkeleton />
                ) : (paginated?.length ?? 0) > 0 ? (
                    <TableBody>
                        {paginated?.map((el: product, index: number) => (
                            <TableRow
                                key={el.id}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                <TableCell className="font-medium text-muted-foreground">
                                    #{index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {el.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {el.cost_price?.toLocaleString()} so'm
                                </TableCell>
                                <TableCell className="font-medium">
                                    25,000 so'm
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${el.quantity > 10
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : el.quantity > 0
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                        {el.quantity}
                                    </span>
                                </TableCell>
                                <TableCell className="capitalize text-muted-foreground">
                                    {el.unit.name}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-x-4 justify-center  items-center">
                                        <EditProsucts {...el} />
                                        <ProductView {...el} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                ) : (
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                Mahsulotlar topilmadi
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )}
            </Table>

            <PaginationContyent
                currentPage={currentPage}
                setPostPerPage={(n) => {
                    setPostsPerPage(n);
                    setCurrentPage(1);
                }}
                postsPerPage={postsPerPage}
                setCurrentPage={(n) => setCurrentPage(n)}
                totalPosts={lowProducts?.total || 0}
            />
        </div>
    );
};

export default LowProductTable;
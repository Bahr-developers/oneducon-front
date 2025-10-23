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
import { Skeleton } from "@/components/ui/skeleton"
import EditProsucts from "./edit-products";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { productUtils } from "@/utils/products";
import { categoryType, product } from "@/types";
import { categoryUtils } from "@/utils/categories";
import ProductView from "./product-view";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import PaginationContyent from "@/components/_components/pagination";
import { useDebounce } from "@/components/functions/useDebounce";
import { useQueryParams } from "@/components/functions/query-params";
import ProductsTableSkeleton from "./product-skeleton";



const Productstable = () => {
    const { updateURL, getParam } = useQueryParams();

    // URL dan qiymatlarni olish
    const [postsPerPage, setPostsPerPage] = useState<number>(
        () => parseInt(getParam('limit', '5'))
    );
    const [currentPage, setCurrentPage] = useState<number>(
        () => parseInt(getParam('page', '1'))
    );
    const [searchQuery, setSearchQuery] = useState<string>(
        () => getParam('search', '')
    );
    const [selectedCategory, setSelectedCategory] = useState<string>(
        () => getParam('category', '')
    );

    // Debounced search
    const debouncedSearch = useDebounce(searchQuery, 500);

    // URL ni yangilash
    useEffect(() => {
        updateURL({
            search: debouncedSearch,
            category: selectedCategory,
            page: currentPage.toString(),
            limit: postsPerPage.toString(),
        });
    }, [debouncedSearch, selectedCategory, currentPage, postsPerPage, updateURL]);

    // API query
    const { data: procusts, isLoading } = useQuery<{ data: product[], total: number }>({
        queryKey: ['get_all_procusts', debouncedSearch, selectedCategory, postsPerPage, currentPage],
        queryFn: async () => await productUtils.getProducts({
            limit: postsPerPage,
            page: currentPage,
            search: debouncedSearch,
            category: selectedCategory
        })
    })

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['get_all_categories'],
        queryFn: categoryUtils.getCategory
    })






    const totalPages = Math.max(1, Math.ceil((procusts?.total || 1) / postsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [currentPage, totalPages]);

    const paginated = procusts?.data

    return (
        <div className="mt-4">
            <div className="border rounded-xl p-4 bg-card">
                <div className="flex my-4 justify-between gap-4 flex-wrap">
                    <div className="relative w-full sm:w-[450px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 pl-10 bg-background"
                        />
                    </div>
                    <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value)}>
                        <SelectTrigger className="w-full sm:w-[280px] h-11">
                            <SelectValue placeholder="Kategoriya" />
                        </SelectTrigger>
                        <SelectContent>
                            {categoriesLoading ? (
                                <div className="p-2">
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : (
                                categories?.data?.map((el: categoryType) => (
                                    <SelectItem value={el.id} key={el.id}>
                                        {el.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border overflow-hidden">
                    <Table>
                        <TableHeader>
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
                </div>
            </div>
            <PaginationContyent
                currentPage={currentPage}
                setPostPerPage={(n) => {
                    setPostsPerPage(n);
                    setCurrentPage(1);
                }}
                postsPerPage={postsPerPage}
                setCurrentPage={(n) => setCurrentPage(n)}
                totalPosts={procusts?.total || 0}
            />
        </div>
    );
};

export default Productstable;
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

const ProductsTableSkeleton = () => {
    return (
        <TableBody>
            {[...Array(7)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-5 w-12" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-x-3 justify-center items-center">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-8 w-8 rounded" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

const Productstable = () => {
    const { data: procusts, isLoading } = useQuery({
        queryKey: ['get_all_procusts'],
        queryFn: productUtils.getProducts
    })
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['get_all_categories'],
        queryFn: categoryUtils.getCategory
    })

    return (
        <div className="mt-4">
            <div className="border rounded-xl p-4 bg-card">
                <div className="flex my-4 justify-between gap-4 flex-wrap">
                    <div className="relative w-full sm:w-[450px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Qidirish..."
                            className="h-11 pl-10 bg-background"
                        />
                    </div>
                    <Select>
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
                                <TableHead className="text-right font-semibold">Amallar</TableHead>
                            </TableRow>
                        </TableHeader>
                        {isLoading ? (
                            <ProductsTableSkeleton />
                        ) : procusts?.data?.length > 0 ? (
                            <TableBody>
                                {procusts.data.map((el: product, index: number) => (
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
                                            <div className="flex gap-x-2 justify-center items-center">
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
        </div>
    );
};

export default Productstable;
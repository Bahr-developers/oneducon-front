import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { customerType, customerUtils } from "@/utils/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditCustomer from "./edit-cust";
import toast from "react-hot-toast";
import { DeleteConfirm } from "@/components/ui/alerd-dialog";

const CustomerTableSkeleton = () => {
    return (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-x-5 justify-center items-center">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-8 w-8 rounded" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

const CustomeTable = () => {
    const { data: customers, isLoading } = useQuery({
        queryKey: ['customers'],
        queryFn: customerUtils.getCustomer
    })
    const queryClient = useQueryClient()

    const deleteCustomer = useMutation({
        mutationFn: customerUtils.deleteCustomer,
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['customers'] })
        },
        onError: (err) => {
            toast.error('error')
            console.log(err);
        }
    })

    return (
        <div className="my-4">
            <div className="border rounded-xl overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b">
                            <TableHead className="w-[120px] font-semibold">Ismi</TableHead>
                            <TableHead className="font-semibold">Telefon raqami</TableHead>
                            <TableHead className="text-right font-semibold">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <CustomerTableSkeleton />
                    ) : customers?.data?.length > 0 ? (
                        <TableBody>
                            {customers.data.map((el: customerType) => (
                                <TableRow
                                    key={el.id}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell className="capitalize font-medium">
                                        {el.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {el.phone}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-x-3 justify-center items-center">
                                            <EditCustomer customer={el} />
                                            <DeleteConfirm onConfirm={() => deleteCustomer.mutate(el.id || '1')} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                    Mijozlar topilmadi
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </div>
        </div>
    );
};

export default CustomeTable;
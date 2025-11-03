import {
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"


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

export default DebtsTableSkeleton
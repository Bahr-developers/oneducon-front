import {
    TableBody,
    TableCell,

    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
const SelesTableSkeleton = () => {
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



export default SelesTableSkeleton;
import { Skeleton } from "../ui/skeleton";

const TableBodySkeleton = () => {
    return (
        <tbody>
            {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b">
                    <td className="px-4 py-2">
                        <Skeleton className="h-4 w-[120px]" />
                    </td>
                    <td className="px-4 py-2">
                        <Skeleton className="h-4 w-[60px]" />
                    </td>
                    <td className="px-4 py-2">
                        <Skeleton className="h-4 w-[80px]" />
                    </td>
                    <td className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default TableBodySkeleton;

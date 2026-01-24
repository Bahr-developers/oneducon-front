import { Badge } from "@/components/ui/badge";

export default function OrderHeader({
    count,
}: {
    count: number;
}) {
    return (
        <div className="border-b p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-2xl font-semibold">Korzinka</div>
                    <Badge variant="secondary">{count}</Badge>
                </div>
            </div>
        </div>
    );
}

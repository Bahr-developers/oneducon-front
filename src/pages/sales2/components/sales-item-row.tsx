import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OrderItem } from "@/types/sales-type2";


export default function OrderItemRow({ item }: { item: OrderItem }) {
    const lineTotal = item.count * item.price - (item.discount || 0);

     function formatUZS(value: number) {
        const s = Math.round(value).toString();
        const spaced = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return `${spaced} UZS`;
    }


    return (
        <Card className="p-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    {/* rasm yo‘q: product_id ko‘rsatamiz */}
                    <div className="truncate text-sm font-medium">
                        Mahsulot: <span className="font-semibold">{item.product_id}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Soni: {item.count} dona</span>
                        <span>•</span>
                        <span>Narx: {formatUZS(item.price)}</span>
                        {item.discount > 0 && (
                            <>
                                <span>•</span>
                                <span>Chegirma: {formatUZS(item.discount)}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-sm font-semibold">{formatUZS(lineTotal)}</div>
                    {item.discount > 0 && <Badge className="mt-2" variant="secondary">Chegirma bor</Badge>}
                </div>
            </div>
        </Card>
    );
}

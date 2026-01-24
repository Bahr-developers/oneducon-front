import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

type CartItem = {
    product_id: string;
    name: string;
    price: number;
    count: number;
    discount: number;
    clientName:string;
};

export default function OrderItemsList({
    items,
    onChangeCount,
    onRemove,
}: {
    items: CartItem[];
    onChangeCount: (productId: string, count: number) => void;
    onRemove: (productId: string) => void;
}) {
    if (items.length === 0) {
        return (
            <div className="p-4">
                <div className="h-[520px] rounded-xl border flex items-center justify-center text-center">
                    <div>
                        <div className="text-lg font-semibold">Korzinka hozircha bo‘sh</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                            Tepadan qidirib mahsulot qo‘shing
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 space-y-3">
            {items.map((it) => (
                <div
                    key={it.product_id}
                    className="rounded-xl border p-3 flex items-center justify-between"
                >
                    <div className="min-w-0">
                        <div className="text-xs text-muted-foreground mt-1">ID: {it.product_id}</div>
                        <div >
                            {it.clientName}
                        </div>
                        <div className="font-semibold truncate">{it.name}</div>

                        <div className="mt-2 flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onChangeCount(it.product_id, it.count - 1)}
                            >
                                -
                            </Button>
                            <div className="w-10 text-center">{it.count}</div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onChangeCount(it.product_id, it.count + 1)}
                            >
                                +
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                            <div className="flex items-center gap-3">
                                <div className="text-right font-semibold">{it.price} UZS</div>

                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </div>



                        <Button variant="outline" size="sm" onClick={() => onRemove(it.product_id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

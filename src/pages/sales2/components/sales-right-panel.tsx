import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMemo, useState } from "react";

type CartItem = {
    product_id: string;
    name: string;
    price: number;
    count: number;
    discount: number;
};

export default function OrderRightPanel({ items }: { items: CartItem[] }) {
    const [clientQuery, setClientQuery] = useState("");
    const [paymentType, setPaymentType] = useState("");

    const subtotal = useMemo(
        () => items.reduce((a, it) => a + (Number(it.price) || 0) * (Number(it.count) || 0), 0),
        [items]
    );
    const discount = useMemo(
        () => items.reduce((a, it) => a + (Number(it.discount) || 0), 0),
        [items]
    );
    const total = Math.max(subtotal - discount, 0);

    // Hozircha payment yo‘q (API yo‘q) -> 0
    const paid = 0;
    const remaining = Math.max(total - paid, 0);

    return (
        <div className="space-y-4">
            <div className="rounded-xl border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-sm text-muted-foreground">Mijoz</div>
                        <div className="text-base font-semibold">Tanlanmagan</div>
                        <div className="text-sm text-muted-foreground"></div>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm">Yangi</Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-[420px] sm:w-[520px] p-2.5">
                            <SheetHeader>
                                <SheetTitle>Yangi mijoz</SheetTitle>
                            </SheetHeader>

                            <div className="mt-6 space-y-4">
                                <div className="grid gap-2">
                                    <div className="text-sm text-muted-foreground">Ism *</div>
                                    <Input placeholder="Ism kiriting" />
                                </div>

                                <div className="grid gap-2">
                                    <div className="text-sm text-muted-foreground">Familiya</div>
                                    <Input placeholder="Familiya kiriting" />
                                </div>

                                <div className="grid gap-2">
                                    <div className="text-sm text-muted-foreground">Telefon *</div>
                                    <Input placeholder="+998 __ ___ __ __" />
                                </div>

                                <div className="pt-2">
                                    <Button className="w-full h-11">Yaratish</Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="mt-4 space-y-2">
                    <Input
                        placeholder="Mijoz: ism yoki telefon..."
                        value={clientQuery}
                        onChange={(e) => setClientQuery(e.target.value)}
                    />
                    <Input
                        placeholder="To‘lov turi (id)"
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-background p-4 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Jami</div>
                    <div className="font-semibold">{subtotal} UZS</div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Chegirma</div>
                    <div className="font-semibold">{discount} UZS</div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">To‘langan</div>
                    <div className="font-semibold">{paid} UZS</div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Qoldiq</div>
                    <div className="font-semibold">{remaining} UZS</div>
                </div>

                <Button className="w-full h-11 mt-3" disabled={items.length === 0}>
                    To‘lash
                </Button>
            </div>
        </div>
    );
}

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import OrderHeader from "./components/sales-header";
import OrderItemsList from "./components/sales-item-list";
import OrderRightPanel from "./components/sales-right-panel";
import { orderUtils } from "@/utils/orders";
import TopProductSearch from "./components/top-search";
import { Client, Product } from "@/types/sales-type2";

export default function OrderPage() {
    const [topSearch, setTopSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [cartItems, setCartItems] = useState<
        Array<{
            product_id: string;
            name: string;
            price: number;
            count: number;
            discount: number;
            clientName:string;
        }>
    >([]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["get_all_products"],
        queryFn: () => orderUtils.getOrders2(),
    });

    const orders = data?.data ?? [];

    const { clients: products } = useMemo(() => {
        const map = new Map<string, Client>();

        for (const o of (orders ?? [])) {
            if (!o) continue;

            const c = o.client;
            if (!c?.id) continue;

            const id = String(c.id);

            if (!map.has(id)) {
                map.set(id, {
                    id,
                    name: String(c.name ?? ""),
                    phone: String(c.phone ?? ""),
                    order_items: [],
                    store_id: c.store_id ?? "",
                    created_at: c.created_at ?? new Date().toISOString(),
                    updated_at: c.updated_at ?? new Date().toISOString(),
                });
            }

            const items = Array.isArray(o.order_items) ? o.order_items : [];
            map.get(id)!.order_items.push(...items);
        }
        return {
            clients: Array.from(map.values()),
        };
    }, [orders]);

    const results = useMemo(() => {
        const q = topSearch.trim().toLowerCase();
        if (!q) return [];

        const map = new Map<string, Product>();

        for (const client of products) {
            const items = Array.isArray(client.order_items) ? client.order_items : [];

            for (const orderItem of items) {
                const product = orderItem?.product; // ✅ bitta object
                if (!product?.id) continue;

                const hay = `${product.name ?? ""} ${product.id}`.toLowerCase();
                if (hay.includes(q)) {
                    product.clientName=client.name
                    map.set(String(product.id), product);
                }
            }
        }

        return Array.from(map.values());
    }, [products, topSearch]);


    function addToCart(p: Product) {
        const pid = String(p.id);

        setCartItems((prev) => {
            const idx = prev.findIndex((x) => x.product_id === pid);

            if (idx >= 0) {
                const copy = [...prev];
                copy[idx].count += 1;
                return copy;
            }

            return [
                ...prev,
                {
                    product_id: pid,
                    name: p.name,
                    price: Number(p.usd_rate ?? 0),
                    count: 1,
                    discount: 0,
                    clientName: p.clientName ?? "Nomaʼlum",
                },
            ];
        });

        setTopSearch("");
        setOpen(false);
    }


    const remove = (productId: string) => {
        setCartItems((prev) => prev.filter((it) => it.product_id !== productId));
    }

    if (isLoading) {
        return <div className="rounded-xl border bg-background p-6">Yuklanmoqda...</div>;
    }

    if (isError) {
        return <div className="rounded-xl border bg-background p-6">Xatolik bo'ldi.</div>;
    }

    return (
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
            <div className="rounded-xl border bg-background">
                <TopProductSearch
                    value={topSearch}
                    onChange={(v: string) => {
                        setTopSearch(v);
                        setOpen(!!v.trim());
                    }}
                    open={open}
                    results={results}
                    onPick={addToCart}
                    onClose={() => setOpen(false)}
                />

                <OrderHeader count={cartItems.length} />

                <OrderItemsList
                    items={cartItems}
                    onChangeCount={(productId: string, count: number) => {
                        setCartItems((prev) =>
                            prev.map((it) =>
                                it.product_id === productId ? { ...it, count: Math.max(count, 1) } : it
                            )
                        );
                    }}
                    onRemove={remove}
                />
            </div>

            <OrderRightPanel items={cartItems} />
        </div>
    );
}
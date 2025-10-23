export interface categoryType {
    id: string,
    name: string,
    store_id: string
}
export interface product {
    id: string
    name: string
    category: categoryType
    unit: categoryType
    store_id: string
    quantity: number
    reminder_quantity: number
    cost_price: number
    cost_price_usd: number
    sale_price: number
    sale_price_usd: number
    usd_rate: number
    count: number
}

export interface user {
    id: string;
    name: string;
    email: string;
    password: string;
    is_active: boolean;
    link: string | null;
    usd_rate: number | null;
    user_id: string;
}
export interface debt {
    id: string;
    client_id: string;
    order_id: string;
    store_id: string;
    price: number;
    reminder: string;
    status: 'UNPAID' | 'PAID';
}
export interface client {
    id: string;
    name: string;
    phone?: string;      // ba'zan bo'lmasligi mumkin
    store_id?: string;
}
export interface orderItem {
    id?: string;
    order_id: string;
    product_id?: string;
    name?: string;
    quantity?: number;
    price?: number;
    total?: number;
}
export interface payment {
    id?: string;
    payment_method?: string;
    amount?: number;
    paid_at?: string | null;
    note?: string | null;
}
export interface order {
    id: string;
    order_number?: number;
    client_id?: string;
    client?: client;
    store_id?: string;
    order_items: orderItem[];
    payments: payment[];
    debts?: debt[];            // hozir bo'sh array ko'rinadi — lekin type qo'yildi
    total_price: number;       // misolda 109
    created_at?: string;
    // qo'shimcha maydonlar (status, updated_at, etc.) kerak bo'lsa shu yerga qo'shing
}
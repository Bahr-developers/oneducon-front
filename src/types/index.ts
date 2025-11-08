export interface categoryType {
    id: string,
    name: string,
    store_id: string
}
export interface paymentType {
    id: string,
    name: string
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
    created_at: string
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
    status: string;
    client: client;
    order: order
}

export interface sotreDebts {
    client: client,
    user_id: number,
    debts: debt[]
    total_amount: number
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
    name: string;
    count: number
    discount: number
    quantity?: number;
    price?: number;
    total?: number;
    product: product
}
export interface payment {
    id?: string;
    price?: number
    payment_type: paymentType
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
}

export interface expensesType {
    id: string,
    name: string,
    created_at: string
}
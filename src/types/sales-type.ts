// src/features/sale/saleTypes.ts

export interface Item {
    product_id: number;
    count: number;
    discount: number;
    price: number;
}

export interface Payment {
    payment_type_id: number;
    price: number;
}

export interface Debt {
    price: number;
    return_time: string;
    reminder: string;
    client_id: number;
}

export interface SaleState {
    store_id: number | null;
    client_id: number | null;
    items: Item[];
    payments: Payment[];
    debts: Debt[];
    loading: boolean;
    success: boolean;
    error: boolean;
}

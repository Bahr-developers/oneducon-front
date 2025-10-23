import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
    id: number;
    name: string;
    cost_price: number;
    cost_price_usd: number;
    sale_price: number;
    stock: number;
}

export interface OrderItem {
    id: string; // unikal frontend ID
    product: Product | null;
    count: number;
    discount: number;
    total_price: number;
}

export interface SaleState {
    items: OrderItem[];
}

const initialState: SaleState = {
    items: [],
};

const saleSlice = createSlice({
    name: "sale",
    initialState,
    reducers: {
        addOrderItem: (state) => {
            state.items.push({
                id: crypto.randomUUID(),
                product: null,
                count: 1,
                discount: 0,
                total_price: 0,
            });
        },
        removeOrderItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        setProductToItem: (
            state,
            action: PayloadAction<{ id: string; product: Product }>
        ) => {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (item) {
                item.product = action.payload.product;
                item.total_price = item.count * action.payload.product.sale_price;
            }
        },
        setItemCount: (state, action: PayloadAction<{ id: string; count: number }>) => {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (item && item.product) {
                item.count = action.payload.count;
                item.total_price = action.payload.count * item.product.sale_price;
            }
        },
    },
});

export const { addOrderItem, removeOrderItem, setProductToItem, setItemCount } =
    saleSlice.actions;

export default saleSlice.reducer;

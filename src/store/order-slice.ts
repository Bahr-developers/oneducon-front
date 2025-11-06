// src/store/order-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";
import { product } from "@/types";


export interface OrderItem {
    id: string;
    product: product | null;
    product_id: number;
    count: number;
    discount: number;
    price: number;
}

export interface Payment {
    payment_type_id: string;
    price: number;
}

export interface Debt {
    price: number;
    return_time: string;
    reminder: string;
    client_id: number;
}

interface OrderState {
    items: OrderItem[];
    payments: Payment[];
    debt: Debt | null;
    totalItemsAmount: number;
    totalPaidAmount: number;
    remainingDebt: number;
    hasDebt: boolean;
}

const initialState: OrderState = {
    items: [],
    payments: [],
    debt: null,
    totalItemsAmount: 0,
    totalPaidAmount: 0,
    remainingDebt: 0,
    hasDebt: false,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        addOrderItem: (state) => {
            state.items.push({
                id: crypto.randomUUID(),
                product: null,
                product_id: 0,
                count: 1,
                discount: 0,
                price: 0,
            });
        },

        removeOrderItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            recalculateTotals(state);
        },

        updateOrderItem: (
            state,
            action: PayloadAction<{ id: string; updates: Partial<OrderItem> }>
        ) => {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (item) {
                Object.assign(item, action.payload.updates);
                recalculateTotals(state);
            }
        },

        setProductToItem: (
            state,
            action: PayloadAction<{ id: string; product: product }>
        ) => {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (item) {
                item.product = action.payload.product;
                item.product_id = Number(action.payload.product.id);
                item.price = action.payload.product.sale_price;
                recalculateTotals(state);
            }
        },

        // ======== PAYMENTS ========
        addPayment: (state) => {
            state.payments.push({
                payment_type_id: "",
                price: 0,
            });
        },

        updatePayment: (
            state,
            action: PayloadAction<{ index: number; payment: Payment }>
        ) => {
            state.payments[action.payload.index] = action.payload.payment;
            recalculateTotals(state);
        },

        removePayment: (state, action: PayloadAction<number>) => {
            state.payments = state.payments.filter((_, i) => i !== action.payload);
            recalculateTotals(state);
        },

        // ======== DEBT ========
        setDebt: (state, action: PayloadAction<Debt>) => {
            state.debt = action.payload;
        },

        clearDebt: (state) => {
            state.debt = null;
            state.hasDebt = false;
        },

        // ======== RESET ========
        resetOrder: () => {
            return initialState;
        },
    },
});

// Helper function - hisoblashlar
function recalculateTotals(state: OrderState) {
    // 1. Items umumiy summasi
    state.totalItemsAmount = state.items.reduce((sum, item) => {
        if (item.product) {
            return sum + (item.price - item.discount) * item.count;
        }
        return sum;
    }, 0);

    // 2. To'langan summa
    state.totalPaidAmount = state.payments.reduce((sum, payment) => {
        return sum + Number(payment.price || 0);
    }, 0);

    // 3. Qarz summasi
    state.remainingDebt = Math.max(
        0,
        state.totalItemsAmount - state.totalPaidAmount
    );

    // 4. Qarz bormi?
    state.hasDebt = state.remainingDebt > 0 && state.totalItemsAmount > 0;

    // 5. Agar qarz bo'lmasa, debt objectni tozalash
    if (!state.hasDebt) {
        state.debt = null;
    } else if (state.debt) {
        // Agar qarz bor va debt object mavjud bo'lsa, price ni yangilash
        state.debt.price = state.remainingDebt;
    }
}

export const {
    addOrderItem,
    removeOrderItem,
    updateOrderItem,
    setProductToItem,
    addPayment,
    updatePayment,
    removePayment,
    setDebt,
    clearDebt,
    resetOrder,
} = orderSlice.actions;

// Selectors
export const selectOrder = (state: RootState) => state.order;
export const selectOrderItems = (state: RootState) => state.order.items;
export const selectPayments = (state: RootState) => state.order.payments;
export const selectDebt = (state: RootState) => state.order.debt;
export const selectTotals = (state: RootState) => ({
    totalItemsAmount: state.order.totalItemsAmount,
    totalPaidAmount: state.order.totalPaidAmount,
    remainingDebt: state.order.remainingDebt,
    hasDebt: state.order.hasDebt,
});

export default orderSlice.reducer;
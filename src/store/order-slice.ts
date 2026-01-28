// src/store/order-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";
import { product } from "@/types";

export interface OrderItem {
    id: string;
    product: product; // Null bo'lmaydi endi
    product_id: number;
    count: number;
    discount: number;
    price: number;
}

// ... Payment va Debt interfacelari o'zgarmaydi ...
export interface Payment {
    payment_type_id: string;
    price: number;
    isNew?: boolean;
    userModified?: boolean;
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
    items: [], // Boshlang'ich holat bo'sh bo'ladi
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
        // YANGI ACTION: To'g'ridan-to'g'ri mahsulot qo'shish
        addProductToOrder: (state, action: PayloadAction<product>) => {
            // Agar mahsulot allaqachon bor bo'lsa, uni countini oshirish mumkin
            // Lekin sizning talabingiz bo'yicha "arrayga qo'shilib ketaveradi"
            
            const newProduct = action.payload;
            
            state.items.push({
                id: crypto.randomUUID(),
                product: newProduct,
                product_id: Number(newProduct.id),
                count: 1,
                discount: 0,
                price: newProduct.sale_price,
            });

            recalculateTotals(state);

            // Avtomatik to'lov (Naqd) qo'shish logikasi (agar birinchi mahsulot bo'lsa)
            if (state.items.length === 1 && state.payments.length === 0) {
                 state.payments.push({
                    payment_type_id: "1",
                    price: state.totalItemsAmount,
                    isNew: true,
                });
                recalculateTotals(state);
            }
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

        // ======== PAYMENTS (O'zgarmadi) ========
        addPayment: (state) => {
            state.payments.push({
                payment_type_id: "",
                price: 0,
                isNew: true,
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

        // ======== DEBT (O'zgarmadi) ========
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

// Helper function (O'zgarmadi)
function recalculateTotals(state: OrderState) {
    state.totalItemsAmount = state.items.reduce((sum, item) => {
        if (item.product && item.product_id) {
            return sum + (item.price - item.discount) * item.count;
        }
        return sum;
    }, 0);

    state.totalPaidAmount = state.payments.reduce((sum, payment) => {
        return sum + Number(payment.price || 0);
    }, 0);

    state.remainingDebt = Math.max(0, state.totalItemsAmount - state.totalPaidAmount);
    state.hasDebt = state.remainingDebt > 0 && state.totalItemsAmount > 0;

    if (!state.hasDebt || state.remainingDebt === 0) {
        state.debt = null;
    } else if (state.debt) {
        state.debt.price = state.remainingDebt;
    }
}

export const {
    addProductToOrder, // O'zgargan action
    removeOrderItem,
    updateOrderItem,
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
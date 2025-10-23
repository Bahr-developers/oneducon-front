// store/order/orderPayments.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Payment {
    id?: number;
    payment_type_id: string;
    price: number;
}

interface PaymentsState {
    payments: Payment[];
}

const initialState: PaymentsState = {
    payments: [{ payment_type_id: "", price: 0 }],
};

const orderPaymentsSlice = createSlice({
    name: "orderPayments",
    initialState,
    reducers: {
        addPayment: (state, action: PayloadAction<Payment>) => {
            state.payments.push(action.payload);
        },
        updatePayment: (state, action) => {
            const { index, payment } = action.payload;
            const newPayments = [...state.payments];
            newPayments[index] = payment;
            state.payments = newPayments;
        },
        removePayment: (state, action: PayloadAction<number>) => {
            state.payments = state.payments.filter((_, i) => i !== action.payload);
        },
        clearPayments: (state) => {
            state.payments = [];
        },
    },
});

export const { addPayment, updatePayment, removePayment, clearPayments } =
    orderPaymentsSlice.actions;

export default orderPaymentsSlice.reducer;

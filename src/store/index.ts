// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import saleReducer from "./sales-store";
import orderPaymentsSlice from './payments-store';
import debts from './debts-slice';
import orderReducer from './order-slice'; // YANGI QO'SHILGAN

export const store = configureStore({
    reducer: {
        sale: saleReducer,
        orderPayments: orderPaymentsSlice,
        debts: debts,
        order: orderReducer, // YANGI QO'SHILGAN
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
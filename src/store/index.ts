// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import orderReducer from './order-slice';
import paginationReducer from './paginationSlice.ts'
export const store = configureStore({
    reducer: {
        order: orderReducer,
        pagination: paginationReducer
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

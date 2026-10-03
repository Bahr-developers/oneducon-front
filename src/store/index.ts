import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './order-slice'
import paginationReducer from './paginationSlice'
import authReducer from './auth-slice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        order: orderReducer,
        pagination: paginationReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
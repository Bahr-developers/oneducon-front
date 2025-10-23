// store/debts-slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface OrderState {
    totalAmount: number;
    paidAmount: number;
    hasDebt: boolean;
}

const initialState: OrderState = {
    totalAmount: 0,
    paidAmount: 0,
    hasDebt: false,
};

const debtsSlice = createSlice({
    name: "debts",
    initialState,
    reducers: {
        updateTotals: (state, action) => {
            const { totalAmount, paidAmount } = action.payload;
            state.totalAmount = totalAmount;
            state.paidAmount = paidAmount;
            state.hasDebt = paidAmount < totalAmount;
        },
    },
});

export const { updateTotals } = debtsSlice.actions;
export const selectDebtState = (state: RootState) => state.debts;
export default debtsSlice.reducer;

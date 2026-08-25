
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface PaginationState {
    postsPerPage: number
}

const initialState: PaginationState = {
    postsPerPage: 5,
}

const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        setPostsPerPage: (state, action: PayloadAction<number>) => {
            state.postsPerPage = action.payload
        },
    },
})

export const { setPostsPerPage } = paginationSlice.actions

export default paginationSlice.reducer
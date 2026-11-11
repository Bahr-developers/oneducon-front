import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { logout, setAuth } from './auth-slice'

export interface SelectedProduct {
	id: string
	name: string
	barcode?: string | null
}

type Selection = Record<string, SelectedProduct>
type LabelUpdate = Pick<SelectedProduct, 'id'> & Partial<SelectedProduct>

const initialState: Selection = {}

const productSelection = createSlice({
	name: 'productSelection',
	initialState,
	reducers: {
		selectProducts: (state, { payload }: PayloadAction<SelectedProduct[]>) => {
			for (const { id, name, barcode } of payload) {
				state[id] = { id, name, barcode }
			}
		},
		deselectProducts: (state, { payload }: PayloadAction<string[]>) => {
			for (const id of payload) delete state[id]
		},
		clearProductSelection: () => initialState,
		updateSelectedLabels: (state, { payload }: PayloadAction<LabelUpdate[]>) => {
			for (const { id, name, barcode } of payload) {
				const product = state[id]
				if (!product) continue
				if (name !== undefined) product.name = name
				if (barcode !== undefined) product.barcode = barcode
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(setAuth, () => initialState)
			.addCase(logout, () => initialState)
	},
})

export const {
	selectProducts,
	deselectProducts,
	clearProductSelection,
	updateSelectedLabels,
} = productSelection.actions

export default productSelection.reducer

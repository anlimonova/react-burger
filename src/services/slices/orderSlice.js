import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ORDER_URL } from '@/constants/api.js';

export const fetchOrderDetails = createAsyncThunk(
	'order/fetchOrderDetails',
	/**
	 * @param {string[]} ingredientIds
	 * 	@param {object} thunkAPI
	 */
	async (ingredientIds, thunkAPI) => {
		try {
			const response = await fetch(ORDER_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ingredients: ingredientIds,
				}),
			});

			if (!response.ok) {
				throw new Error(`Ошибка HTTP: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

const initialState = {
	orderDetails: {
		name: null,
		order: {
			number: null,
		},
		success: null,
	},
	loading: false,
	error: null,
};

export const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOrderDetails.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchOrderDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetails = action.payload;
			})
			.addCase(fetchOrderDetails.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

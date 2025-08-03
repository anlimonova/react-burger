import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ORDER_ENDPOINT } from '@/constants/api.js';
import { request } from '@utils/request.js';

export const fetchOrderDetails = createAsyncThunk(
	'order/fetchOrderDetails',
	/**
	 * @param {string[]} ingredientIds
	 * @param {object} thunkAPI
	 */
	async (ingredientIds, thunkAPI) => {
		try {
			const data = await request(ORDER_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ingredients: ingredientIds,
				}),
			});
			return data;
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

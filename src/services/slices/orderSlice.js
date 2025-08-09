import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '@utils/api.js';

export const fetchOrderDetails = createAsyncThunk(
	'order/fetchOrderDetails',
	/**
	 * @param {string[]} ingredientIds
	 * @param {object} thunkAPI
	 */
	async ({ ingredientIds, accessToken }, thunkAPI) => {
		try {
			return await API.orderDetails(ingredientIds, accessToken);
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

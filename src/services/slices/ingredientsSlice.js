import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@utils/api.js';

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	async (_, { signal }) => {
		try {
			const data = await API.getIngredients(signal);
			return data.data;
		} catch (error) {
			throw new Error(error.message || 'Failed to fetch ingredients');
		}
	}
);

const initialState = {
	ingredients: [],
	loading: false,
	error: null,
};

export const ingredientsSlice = createSlice({
	name: 'ingredients',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchIngredients.fulfilled, (state, action) => {
				state.loading = false;
				state.ingredients = action.payload;
			})
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

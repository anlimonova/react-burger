import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INGREDIENTS_ENDPOINT } from '@/constants/api.js';
import { request } from '@utils/request.js';

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	async (_, thunkAPI) => {
		try {
			const data = await request(INGREDIENTS_ENDPOINT, {
				signal: thunkAPI.signal,
			});
			return data.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
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

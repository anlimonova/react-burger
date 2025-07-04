import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	async (ingredientsUrl, thunkAPI) => {
		try {
			const response = await fetch(ingredientsUrl, {
				signal: thunkAPI.signal,
			});
			if (!response.ok) {
				throw new Error(`Ошибка HTTP: ${response.status}`);
			}
			const data = await response.json();
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

import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { selectedIngredientsSlice } from './slices/selectedIngredientsSlice';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsSlice.reducer,
		selectedIngredients: selectedIngredientsSlice.reducer,
	},
});

import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { selectedIngredientsSlice } from './slices/selectedIngredientsSlice';
import { modalSlice } from './slices/modalSlice';
import { orderSlice } from './slices/orderSlice';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsSlice.reducer,
		selectedIngredients: selectedIngredientsSlice.reducer,
		modal: modalSlice.reducer,
		order: orderSlice.reducer,
	},
});

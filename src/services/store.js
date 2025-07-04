import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';

export const store = configureStore({
	reducer: {
		ingredients: ingredientsSlice.reducer,
	},
});

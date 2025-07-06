import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
	bun: null,
	ingredients: [],
};

export const selectedIngredientsSlice = createSlice({
	name: 'selectedIngredients',
	initialState,
	reducers: {
		addIngredient: {
			reducer: (state, action) => {
				const ingredient = action.payload;

				if (ingredient.type === 'bun') {
					state.bun = ingredient;
				} else {
					state.ingredients.push(ingredient);
				}
			},
			prepare: (ingredient) => {
				return { payload: { ...ingredient, uuid: uuidv4() } };
			},
		},
		removeIngredient: (state, action) => {
			state.ingredients = state.ingredients.filter(
				(item) => item.uuid !== action.payload
			);
		},
		resetSelectedIngredients: () => initialState,
		reorderIngredients: (state, action) => {
			const { fromIndex, toIndex } = action.payload;
			const updated = [...state.ingredients];
			const [moved] = updated.splice(fromIndex, 1);
			updated.splice(toIndex, 0, moved);
			state.ingredients = updated;
		},
	},
});

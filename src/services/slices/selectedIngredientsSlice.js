import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
	saveToSession,
	loadFromSession,
	SELECTED_INGREDIENTS_KEY,
} from '@/utils/session';

const initialState = loadFromSession(SELECTED_INGREDIENTS_KEY) || {
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

				saveToSession(state);
			},
			prepare: (ingredient) => {
				return { payload: { ...ingredient, uuid: uuidv4() } };
			},
		},
		removeIngredient: (state, action) => {
			state.ingredients = state.ingredients.filter(
				(item) => item.uuid !== action.payload
			);
			saveToSession(state);
		},
		resetSelectedIngredients: (state) => {
			state.bun = null;
			state.ingredients = [];
			saveToSession(state);
		},
		reorderIngredients: (state, action) => {
			const { fromIndex, toIndex } = action.payload;
			const updated = [...state.ingredients];
			const [moved] = updated.splice(fromIndex, 1);
			updated.splice(toIndex, 0, moved);
			state.ingredients = updated;
			saveToSession(state);
		},
	},
});

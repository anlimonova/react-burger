import {
  saveToSession,
  loadFromSession,
  SELECTED_INGREDIENTS_KEY,
} from '@/utils/session';
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

export type SelectedIngredient = {
  uuid: string;
} & TIngredient;

type SelectedIngredientsState = {
  bun: SelectedIngredient | null;
  ingredients: SelectedIngredient[];
};

const initialState: SelectedIngredientsState = loadFromSession(
  SELECTED_INGREDIENTS_KEY
) ?? {
  bun: null,
  ingredients: [],
};

const uuid: string = uuidv4();

export const selectedIngredientsSlice = createSlice({
  name: 'selectedIngredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<SelectedIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }

        saveToSession(SELECTED_INGREDIENTS_KEY, state);
      },

      prepare: (ingredient: TIngredient): { payload: SelectedIngredient } => ({
        payload: { ...ingredient, uuid },
      }),
    },

    // Удаление ингредиента по uuid
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.uuid !== action.payload
      );
      saveToSession(SELECTED_INGREDIENTS_KEY, state);
    },

    // Сброс всех выбранных ингредиентов
    resetSelectedIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
      saveToSession(SELECTED_INGREDIENTS_KEY, state);
    },

    // Перестановка ингредиентов (drag'n'drop)
    reorderIngredients: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const updated = [...state.ingredients];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      state.ingredients = updated;
      saveToSession(SELECTED_INGREDIENTS_KEY, state);
    },
  },
});

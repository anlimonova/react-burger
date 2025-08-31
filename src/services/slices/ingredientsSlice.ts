import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { API } from '@utils/api';

import type { TIngredient } from '@utils/types';

type IngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | undefined | null;
};

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  {
    rejectValue: string;
  }
>('ingredients/fetchIngredients', async (_, { signal, rejectWithValue }) => {
  try {
    const response = await API.getIngredients(signal);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message: string = error.message || 'Unknown error';
      return rejectWithValue(message);
    }
    return rejectWithValue('Failed to fetch ingredients');
  }
});

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

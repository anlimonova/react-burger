import { configureStore } from '@reduxjs/toolkit';

import { ingredientsSlice } from './slices/ingredientsSlice';
import { modalSlice } from './slices/modalSlice';
import { orderSlice } from './slices/orderSlice';
import { selectedIngredientsSlice } from './slices/selectedIngredientsSlice';
import { userSlice } from './slices/userSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice.reducer,
    selectedIngredients: selectedIngredientsSlice.reducer,
    modal: modalSlice.reducer,
    order: orderSlice.reducer,
    user: userSlice.reducer,
  },
});

// Типы для useSelector и useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

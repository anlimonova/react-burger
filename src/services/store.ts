import { configureStore } from '@reduxjs/toolkit';

import { feedSlice } from './slices/feedSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { modalSlice } from './slices/modalSlice';
import { orderSlice } from './slices/orderSlice';
import { profileOrdersSlice } from './slices/profileOrdersSlice';
import { selectedIngredientsSlice } from './slices/selectedIngredientsSlice';
import { userSlice } from './slices/userSlice';
import { feedMiddleware } from '@services/middlwares/feed-middleware.ts';
import { profileOrdersMiddleware } from '@services/middlwares/profile-orders-middleware.ts';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice.reducer,
    selectedIngredients: selectedIngredientsSlice.reducer,
    modal: modalSlice.reducer,
    order: orderSlice.reducer,
    user: userSlice.reducer,
    feed: feedSlice.reducer,
    profileOrders: profileOrdersSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

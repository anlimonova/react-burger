import { createSlice, createAction } from '@reduxjs/toolkit';

import { isValidOrder } from '@utils/isValirOrder.ts';

import type { TOrdersResponse, TOrder } from '@utils/types';

export const connectProfileOrders = createAction<string>('profileOrders/connect');
export const disconnectProfileOrders = createAction('profileOrders/disconnect');

export const onConnectingProfileOrders = createAction('profileOrders/onConnecting');
export const onOpenProfileOrders = createAction('profileOrders/onOpen');
export const onCloseProfileOrders = createAction('profileOrders/onClose');
export const onErrorProfileOrders = createAction<string>('profileOrders/onError');
export const onMessageProfileOrders = createAction<TOrdersResponse>(
  'profileOrders/onMessage'
);

type ProfileOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: 'offline' | 'connecting' | 'online';
  error: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'offline',
  error: null,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onConnectingProfileOrders, (state) => {
        state.status = 'connecting';
      })
      .addCase(onOpenProfileOrders, (state) => {
        state.status = 'online';
      })
      .addCase(onCloseProfileOrders, (state) => {
        state.status = 'offline';
      })
      .addCase(onErrorProfileOrders, (state, action) => {
        state.error = action.payload;
      })
      .addCase(onMessageProfileOrders, (state, action) => {
        state.orders = Array.isArray(action.payload.orders)
          ? action.payload.orders.filter(isValidOrder)
          : [];
        state.total = action.payload.total ?? 0;
        state.totalToday = action.payload.totalToday ?? 0;
      });
  },
});

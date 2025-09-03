import { createAction, createSlice } from '@reduxjs/toolkit';

import { isValidOrder } from '@utils/isValirOrder.ts';

import type { TOrder, TOrdersResponse } from '@utils/types';

export const connectFeed = createAction<string>('feed/connect');
export const disconnectFeed = createAction('feed/disconnect');

export const onConnectingFeed = createAction('feed/onConnecting');
export const onOpenFeed = createAction('feed/onOpen');
export const onCloseFeed = createAction('feed/onClose');
export const onErrorFeed = createAction<string>('feed/onError');
export const onMessageFeed = createAction<TOrdersResponse>('feed/onMessage');

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: 'offline' | 'connecting' | 'online';
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'offline',
  error: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onConnectingFeed, (state) => {
        state.status = 'connecting';
      })
      .addCase(onOpenFeed, (state) => {
        state.status = 'online';
      })
      .addCase(onCloseFeed, (state) => {
        state.status = 'offline';
      })
      .addCase(onErrorFeed, (state, action) => {
        state.error = action.payload;
      })
      .addCase(onMessageFeed, (state, action) => {
        state.orders = Array.isArray(action.payload.orders)
          ? action.payload.orders.filter(isValidOrder)
          : [];
        state.total = action.payload.total ?? 0;
        state.totalToday = action.payload.totalToday ?? 0;
      });
  },
});

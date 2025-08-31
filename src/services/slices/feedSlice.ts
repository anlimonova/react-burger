import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrdersResponse } from '@utils/types';

type OrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
};

type FetchOrdersArgs = {
  accessToken?: string; // если есть — подключаемся к персональной ленте
};

export const fetchOrders = createAsyncThunk<
  TOrdersResponse,
  FetchOrdersArgs,
  { rejectValue: string }
>('orders/fetchOrders', async ({ accessToken }, { rejectWithValue }) => {
  const wsUrl = accessToken
    ? `wss://norma.nomoreparties.space/orders?token=${accessToken}`
    : 'wss://norma.nomoreparties.space/orders/all';

  return new Promise<TOrdersResponse>((resolve, reject) => {
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event: MessageEvent<string>): void => {
      let data: unknown;
      try {
        data = JSON.parse(event.data);
      } catch {
        reject(new Error('Invalid JSON from server'));
        ws.close();
        return;
      }

      if (typeof data === 'object' && data !== null) {
        const d = data as Record<string, unknown>;

        if (typeof d.message === 'string' && d.message === 'Invalid or missing token') {
          reject(new Error(d.message));
          ws.close();
          return;
        }

        if (d.success === true) {
          resolve(data as TOrdersResponse);
          ws.close();
          return;
        }
      }

      reject(new Error('Ошибка получения заказов'));
      ws.close();
    };

    ws.onerror = (): void => {
      reject(new Error('WebSocket error'));
      ws.close();
    };
  }).catch((err) => {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Неизвестная ошибка');
  });
});

export const feedSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrdersResponse>) => {
          state.loading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(
        fetchOrders.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Неизвестная ошибка';
        }
      );
  },
});

export default feedSlice.reducer;

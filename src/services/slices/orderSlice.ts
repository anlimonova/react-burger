import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API } from '@utils/api';

import type { PayloadAction } from '@reduxjs/toolkit';

type OrderResponse = {
  _id: string;
  name: string;
  number: number;
  status: string;
  ingredients: string[];
  createdAt: string;
};

type FetchOrderByNumberArgs = {
  orderNumber: number;
};

type FetchOrderAcceptingArgs = {
  ingredientIds: string[];
  accessToken: string;
};

type OrderState = {
  orderAccepting: OrderResponse | null;
  orderByNumber: OrderResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orderAccepting: null,
  orderByNumber: null,
  loading: false,
  error: null,
};

export const fetchOrderAccepting = createAsyncThunk<
  OrderResponse,
  FetchOrderAcceptingArgs,
  { rejectValue: string }
>(
  'order/fetchOrderAccepting',
  async ({ ingredientIds, accessToken }, { rejectWithValue }) => {
    try {
      const response = await API.orderAccepting(ingredientIds, accessToken);
      return {
        _id: '', // нет id от API? можно оставить пустым или сгенерировать uuid
        name: response.name,
        number: response.order.number,
        status: 'created',
        ingredients: ingredientIds,
        createdAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch order details';
      return rejectWithValue(message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<
  OrderResponse | null,
  FetchOrderByNumberArgs,
  { rejectValue: string }
>('order/fetchOrderByNumber', async ({ orderNumber }, { rejectWithValue }) => {
  try {
    return await API.getOrderByNumber(orderNumber);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch order by number';
    return rejectWithValue(message);
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderAccepting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderAccepting.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.loading = false;
          state.orderAccepting = action.payload;
        }
      )
      .addCase(
        fetchOrderAccepting.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Неизвестная ошибка';
        }
      )

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<OrderResponse | null>) => {
          state.loading = false;
          state.orderByNumber = action.payload ?? null;
        }
      )
      .addCase(
        fetchOrderByNumber.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Неизвестная ошибка';
        }
      );
  },
});

export default orderSlice.reducer;

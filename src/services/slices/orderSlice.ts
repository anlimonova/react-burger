import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API } from '@utils/api';

import type { PayloadAction } from '@reduxjs/toolkit';

type OrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

type FetchOrderAcceptingArgs = {
  ingredientIds: string[];
  accessToken: string;
};

type OrderState = {
  orderAccepting: OrderResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orderAccepting: null,
  loading: false,
  error: null,
};

export const fetchOrderAccepting = createAsyncThunk<
  OrderResponse,
  FetchOrderAcceptingArgs,
  {
    rejectValue: string;
  }
>(
  'order/fetchOrderAccepting',
  async ({ ingredientIds, accessToken }, { rejectWithValue }) => {
    try {
      const response = await API.orderAccepting(ingredientIds, accessToken);
      return response;
    } catch (error: unknown) {
      let message = 'Failed to fetch order details';
      if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

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
      );
  },
});

export default orderSlice.reducer;

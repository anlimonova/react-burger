import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API } from '@utils/api.ts';

import type { PayloadAction } from '@reduxjs/toolkit';

type OrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

type FetchOrderDetailsArgs = {
  ingredientIds: string[];
  accessToken: string;
};

type OrderState = {
  orderDetails: OrderResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orderDetails: null,
  loading: false,
  error: null,
};

export const fetchOrderDetails = createAsyncThunk<
  OrderResponse,
  FetchOrderDetailsArgs,
  {
    rejectValue: string;
  }
>(
  'order/fetchOrderDetails',
  async ({ ingredientIds, accessToken }, { rejectWithValue }) => {
    try {
      const response = await API.orderDetails(ingredientIds, accessToken);
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
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderDetails.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.loading = false;
          state.orderDetails = action.payload;
        }
      )
      .addCase(
        fetchOrderDetails.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Неизвестная ошибка';
        }
      );
  },
});

export default orderSlice.reducer;

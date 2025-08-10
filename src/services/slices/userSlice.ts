import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API } from '@utils/api.ts';
import { clearTokens, getTokens, saveTokens } from '@utils/authStorage.js';
import { verifyToken } from '@utils/verifyToken.js';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TAuthResponse, TUser } from '@utils/types.ts';

// Состояние слайса
type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
};

// Payload для регистрации и логина
type AuthPayload = {
  name?: string; // для регистрации
  email: string;
  password: string;
};

// Ошибка в rejectWithValue будет строкой
type RejectValue = string;

export const registerUser = createAsyncThunk<
  TAuthResponse,
  AuthPayload,
  { rejectValue: RejectValue }
>('user/register', async ({ name = '', email, password }, thunkAPI) => {
  try {
    const response = await API.register(name, email, password);
    saveTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return response;
  } catch (error: unknown) {
    let message = 'Ошибка при регистрации';
    if (error instanceof Error) message = error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<
  TAuthResponse,
  Omit<AuthPayload, 'name'>,
  { rejectValue: RejectValue }
>('user/login', async ({ email, password }, thunkAPI) => {
  try {
    const response = await API.login(email, password);
    saveTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return response;
  } catch (error: unknown) {
    let message = 'Ошибка при входе';
    if (error instanceof Error) message = error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, string>(
  'user/logout',
  async (refreshToken) => {
    await API.logout(refreshToken);
    clearTokens();
  }
);

export const checkAuth = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/checkAuth',
  async (_, { dispatch, signal }) => {
    try {
      const tokens = getTokens();

      if (!tokens.accessToken || !tokens.refreshToken) {
        dispatch(setIsAuthChecked(true));
        return;
      }

      const result = await verifyToken(tokens.accessToken, tokens.refreshToken, signal);

      if (!result) {
        dispatch(setIsAuthChecked(true));
        return;
      }

      const { user, accessToken: newAccessToken } = result;
      dispatch(setUser(user));

      if (newAccessToken && newAccessToken !== tokens.accessToken) {
        if (
          newAccessToken &&
          newAccessToken !== tokens.accessToken &&
          tokens.refreshToken
        ) {
          saveTokens({ accessToken: newAccessToken, refreshToken: tokens.refreshToken });
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      console.error('Ошибка авторизации:', err instanceof Error ? err.message : err);
      clearTokens();
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
    },
    setIsAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      });
  },
});

export const { setUser, setIsAuthChecked } = userSlice.actions;

export default userSlice.reducer;

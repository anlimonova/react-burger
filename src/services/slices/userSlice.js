import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '@utils/api.js';
import { verifyToken } from '@utils/verifyToken.js';
import { clearTokens, getTokens, saveTokens } from '@utils/authStorage.js';

const initialState = {
	user: null,
	isAuthChecked: false,
};

export const registerUser = createAsyncThunk(
	'user/register',
	async ({ name, email, password }, thunkAPI) => {
		try {
			const response = await API.register(name, email, password);
			saveTokens(response);
			return response;
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error.message || 'Ошибка при регистрации'
			);
		}
	}
);

export const loginUser = createAsyncThunk(
	'user/login',
	async ({ email, password }, thunkAPI) => {
		try {
			const response = await API.login(email, password);
			saveTokens(response);
			return response;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message || 'Ошибка при входе');
		}
	}
);

export const logoutUser = createAsyncThunk(
	'user/logout',
	async (refreshToken) => {
		const response = await API.logout(refreshToken);
		clearTokens();
		return response;
	}
);

export const checkAuth = createAsyncThunk(
	'user/checkAuth',
	async (_, { dispatch, signal }) => {
		try {
			const { accessToken, refreshToken } = getTokens();

			if (!accessToken) {
				dispatch(setIsAuthChecked(true));
				return;
			}

			const result = await verifyToken(accessToken, refreshToken, signal);

			if (!result) {
				dispatch(setIsAuthChecked(true));
				return;
			}

			const { user, accessToken: newAccessToken } = result;
			dispatch(setUser(user));
			if (newAccessToken && newAccessToken !== accessToken) {
				saveTokens({ accessToken: newAccessToken, refreshToken });
			}
		} catch (err) {
			if (err.name === 'AbortError') {
				return;
			}
			console.error('Ошибка авторизации:', err.message);
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
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setIsAuthChecked: (state, action) => {
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

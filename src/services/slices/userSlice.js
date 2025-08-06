import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '@utils/api.js';
import { verifyToken } from '@utils/verifyToken.js';

const initialState = {
	user: null,
	isAuthChecked: false,
};

export const loginUser = createAsyncThunk(
	'user/login',
	async ({ email, password }, thunkAPI) => {
		try {
			return await API.login(email, password);
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message || 'Ошибка при входе');
		}
	}
);

export const logoutUser = createAsyncThunk(
	'user/logout',
	async (refreshToken) => {
		return API.logout(refreshToken);
	}
);

export const registerUser = createAsyncThunk(
	'user/register',
	async ({ name, email, password }, thunkAPI) => {
		try {
			return await API.register(name, email, password);
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error.message || 'Ошибка при регистрации'
			);
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
	selectors: {
		getUser: (state) => state.user,
		getIsAuthChecked: (state) => state.isAuthChecked,
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.isAuthChecked = false;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.isAuthChecked = true;
				localStorage.setItem('accessToken', action.payload.accessToken);
				localStorage.setItem('refreshToken', action.payload.refreshToken);
			})
			.addCase(loginUser.rejected, (state) => {
				state.isAuthChecked = true;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.isAuthChecked = true;
				localStorage.setItem('accessToken', action.payload.accessToken);
				localStorage.setItem('refreshToken', action.payload.refreshToken);
			});
	},
});

export const checkAuth = createAsyncThunk(
	'user/checkAuth',
	async (_, { dispatch }) => {
		try {
			const accessToken = localStorage.getItem('accessToken');
			const refreshToken = localStorage.getItem('refreshToken');

			if (!accessToken) throw new Error('Нет токена');

			const { user, accessToken: newAccessToken } = await verifyToken(
				accessToken,
				refreshToken
			);
			dispatch(setUser(user));
			if (newAccessToken !== accessToken) {
				localStorage.setItem('accessToken', newAccessToken);
			}
		} catch (err) {
			console.error('Ошибка авторизации:', err.message);
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
		} finally {
			dispatch(setIsAuthChecked(true));
		}
	}
);

export const { getUser, getIsAuthChecked } = userSlice.selectors;
export const { setUser, setIsAuthChecked } = userSlice.actions;

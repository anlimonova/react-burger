import { userSlice, registerUser, initialState } from '@/services/slices/userSlice';
import { configureStore } from '@reduxjs/toolkit';

import { expectUnchangedExcept } from '@utils/expectUnchangedExcept.ts';

jest.mock('@utils/api', () => ({
  API: {
    register: jest.fn(),
  },
}));
jest.mock('@utils/authStorage', () => ({
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getTokens: jest.fn(() => ({ accessToken: null, refreshToken: null })),
}));

import { API } from '@utils/api';
import { saveTokens } from '@utils/authStorage';

describe('registerUser thunk', () => {
  const reducer = userSlice.reducer;
  const shape = ['isAuthChecked', 'user'].sort();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('успех: сохраняет токены, устанавливает user и isAuthChecked=true, прочие поля не меняются', async () => {
    const name = 'Anna';
    const email = 'anna@example.com';
    const password = 'secret';
    const response = {
      accessToken: 'Bearer ACCESS_TOKEN_123',
      refreshToken: 'REFRESH_TOKEN_456',
      user: { email, name },
    };
    API.register.mockResolvedValueOnce(response);

    const store = configureStore({ reducer: { user: reducer } });
    expect(store.getState().user).toEqual(initialState);

    const prev = store.getState().user;
    const action = await store.dispatch(registerUser({ name, email, password }));
    const next = store.getState().user;

    expect(API.register).toHaveBeenCalledTimes(1);
    expect(API.register).toHaveBeenCalledWith(name, email, password);

    expect(saveTokens).toHaveBeenCalledTimes(1);
    expect(saveTokens).toHaveBeenCalledWith({
      accessToken: 'ACCESS_TOKEN_123',
      refreshToken: 'REFRESH_TOKEN_456',
    });

    expectUnchangedExcept(prev, next, {
      user: response.user,
      isAuthChecked: true,
    });
    expect(Object.keys(next).sort()).toEqual(shape);
    expect(action.type).toBe(registerUser.fulfilled.type);
    expect(action.payload).toEqual(response);
  });

  test('ошибка: не сохраняет токены, состояние равно initialState', async () => {
    const email = 'test@example.com';
    const password = 'test123';
    API.register.mockRejectedValueOnce(new Error('Ошибка при регистрации'));

    const store = configureStore({ reducer: { user: reducer } });
    expect(store.getState().user).toEqual(initialState);

    const prev = store.getState().user;
    const action = await store.dispatch(registerUser({ name: 'Bob', email, password }));
    const next = store.getState().user;

    expect(API.register).toHaveBeenCalledTimes(1);
    expect(saveTokens).not.toHaveBeenCalled();

    expectUnchangedExcept(prev, next, {});
    expect(next).toEqual(initialState);
    expect(Object.keys(next).sort()).toEqual(shape);
    expect(action.type).toBe(registerUser.rejected.type);
    expect(action.payload).toBe('Ошибка при регистрации');
  });
});

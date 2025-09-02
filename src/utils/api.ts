import { request } from './request';

import type { TAuthResponse, TIngredient } from '@utils/types';

type OrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

type UserData = {
  success: boolean;
  user: {
    name: string;
    email: string;
  };
};

type TokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

type IngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const API = {
  // Получение списка ингредиентов
  getIngredients: (signal?: AbortSignal): Promise<IngredientsResponse> =>
    request('/ingredients', { signal }),

  // Отправка данных заказа
  orderAccepting: (
    ingredientIds: string[],
    accessToken?: string
  ): Promise<OrderResponse> =>
    request('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({ ingredients: ingredientIds }),
    }),

  // Восстановление пароля
  passwordReset: (email: string): Promise<void> =>
    request('/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }),

  // Сброс пароля
  passwordResetConfirm: (password: string, token: string): Promise<void> =>
    request('/password-reset/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, token }),
    }),

  // Регистрация
  register: (name: string, email: string, password: string): Promise<TAuthResponse> =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }),

  // Авторизация
  login: (email: string, password: string): Promise<TAuthResponse> =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  // Выход
  logout: (refreshToken: string): Promise<void> =>
    request('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    }),

  // Обновление токена
  refreshToken: (refreshToken: string): Promise<TokenResponse> =>
    request('/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    }),

  // Получение данных пользователя
  getUser: (accessToken: string, signal?: AbortSignal): Promise<UserData> =>
    request('/auth/user', {
      method: 'GET',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    }),

  // Обновление данных пользователя
  updateUser: (
    name: string,
    email: string,
    password: string,
    accessToken: string
  ): Promise<UserData> =>
    request('/auth/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({ name, email, password }),
    }),
};

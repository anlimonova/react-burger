import { request } from './request';

export const API = {
	// Получение списка ингредиентов
	getIngredients: (signal) => request('/ingredients', { signal }),

	// Отправка данных заказа
	orderDetails: (ingredientIds, accessToken) =>
		request('/orders', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(accessToken && { Authorization: accessToken }),
			},
			body: JSON.stringify({ ingredients: ingredientIds }),
		}),

	// Восстановление пароля
	passwordReset: (email) =>
		request('/password-reset', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		}),

	// Сброс пароля
	passwordResetConfirm: (password, token) =>
		request('/password-reset/reset', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ password, token }),
		}),

	// Регистрация
	register: (name, email, password) =>
		request('/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, email, password }),
		}),

	// Авторизация
	login: (email, password) =>
		request('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		}),

	// Выход
	logout: (refreshToken) =>
		request('/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token: refreshToken }),
		}),

	// Обновление токена
	refreshToken: (refreshToken) =>
		request('/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token: refreshToken }),
		}),

	// Получение данных пользователя
	getUser: (accessToken) =>
		request('/auth/user', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: accessToken,
			},
		}),

	// Обновление данных пользователя
	updateUser: (name, email, password, accessToken) =>
		request('/auth/user', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: accessToken,
			},
			body: JSON.stringify({ name, email, password }),
		}),
};

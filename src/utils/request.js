import checkResponse from './checkResponse';

const BASE_URL = 'https://norma.nomoreparties.space/api';

export function request(endpoint, options = {}) {
	return fetch(`${BASE_URL}${endpoint}`, options).then(checkResponse);
}

import checkResponse from './checkResponse';

const BASE_URL = 'https://norma.nomoreparties.space/api';

export async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  return await checkResponse<T>(res);
}

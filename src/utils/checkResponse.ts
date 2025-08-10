export default async function checkResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return (await res.json()) as T;
  }
  return Promise.reject(new Error(`Ошибка HTTP: ${res.status}`));
}

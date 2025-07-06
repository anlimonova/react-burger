export default async function checkResponse(res) {
	if (res.ok) {
		return res.json();
	}
	return Promise.reject(new Error(`Ошибка HTTP: ${res.status}`));
}

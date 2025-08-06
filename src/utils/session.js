export const SELECTED_INGREDIENTS_KEY = 'selectedIngredients';

export const saveToSession = (key, value) => {
	try {
		sessionStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.error('Ошибка при сохранении в sessionStorage:', e);
	}
};

export const loadFromSession = (key) => {
	try {
		const data = sessionStorage.getItem(key);
		return data ? JSON.parse(data) : undefined;
	} catch (e) {
		console.error('Ошибка при загрузке из sessionStorage:', e);
		return undefined;
	}
};

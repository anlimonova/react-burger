export const SELECTED_INGREDIENTS_KEY = 'selectedIngredients';

/**
 * Сохраняет значение в sessionStorage
 * @param key Ключ
 * @param value Значение
 */
export const saveToSession = <T>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Ошибка при сохранении в sessionStorage:', e);
  }
};

/**
 * Загружает значение из sessionStorage
 * @param key Ключ
 * @returns Значение или undefined
 */
export const loadFromSession = <T>(key: string): T | undefined => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : undefined;
  } catch (e) {
    console.error('Ошибка при загрузке из sessionStorage:', e);
    return undefined;
  }
};

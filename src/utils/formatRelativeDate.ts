export function formatRelativeDate(dateString: string | number | Date): string {
  const date = new Date(dateString);
  const now = new Date();

  // обнуляем время, чтобы сравнивать только дни
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const dateTime = date.toLocaleTimeString().slice(0, -3);

  const diffTime: number = startOfToday.getTime() - startOfDate.getTime();
  const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return `Сегодня, ${dateTime}`;
  if (diffDays === 1) return `Вчера, ${dateTime}`;
  if (diffDays === 2) return `2 дня назад, ${dateTime}`;

  return date.toLocaleString().slice(0, -3);
}

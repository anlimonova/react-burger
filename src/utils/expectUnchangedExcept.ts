// проверяет, что изменились только указанные поля
export function expectUnchangedExcept<T extends object>(
  prev: T,
  next: T,
  changed: Partial<T>
): void {
  (Object.keys(prev) as (keyof T)[]).forEach((key) => {
    if (key in changed) {
      expect(next[key]).toEqual(changed[key]);
    } else {
      expect(next[key]).toEqual(prev[key]);
    }
  });
}

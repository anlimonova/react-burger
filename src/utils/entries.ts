export type ValueOf<T> = T[keyof T];

export function entries<T extends object>(obj: T): [keyof T, ValueOf<T>][] {
  return Object.entries(obj) as [keyof T, ValueOf<T>][];
}

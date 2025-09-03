import type { TOrder } from '@utils/types.ts';

export const isValidOrder = (data: unknown): data is TOrder => {
  return (
    typeof data === 'object' &&
    data !== null &&
    '_id' in data &&
    'status' in data &&
    'name' in data &&
    'number' in data &&
    'ingredients' in data &&
    Array.isArray((data as TOrder).ingredients)
  );
};

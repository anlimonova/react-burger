import type { TModalData } from '@utils/types';

export const isOrderModalData = (data: TModalData): data is { idNumber: number } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'idNumber' in data &&
    typeof (data as { idNumber: unknown }).idNumber === 'number'
  );
};

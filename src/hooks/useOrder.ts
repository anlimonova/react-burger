import { useEffect, useState } from 'react';

import { API } from '@utils/api.ts';

import type { TOrder } from '@utils/types';

export function useOrder(
  orderNumber?: string,
  initialOrders: TOrder[] = []
): TOrder | null {
  const [order, setOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    if (!orderNumber) return;

    const controller = new AbortController();

    const load = async (): Promise<void> => {
      const found = initialOrders.find((o) => String(o.number) === orderNumber);
      if (found) {
        setOrder(found);
        return;
      }

      const fetched = await API.getOrderByNumber(orderNumber, controller.signal);
      setOrder(fetched);
    };

    void load();
    return (): void => controller.abort();
  }, [orderNumber, initialOrders]);

  return order;
}

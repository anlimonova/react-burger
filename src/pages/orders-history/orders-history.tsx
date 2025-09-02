import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks.ts';
import { useEffect } from 'react';

import { FeedOrders } from '@components/feed-orders/feed-orders.tsx';
import { fetchOrders } from '@services/slices/feedSlice.ts';

import type { RootState } from '@services/store.ts';
import type { FC } from 'react';

export const OrdersHistory: FC = () => {
  const { orders } = useAppSelector((state: RootState) => state.feed);
  const accessToken = localStorage.getItem('accessToken') ?? '';

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(fetchOrders({ accessToken }));
    return (): void => {
      promise.abort?.();
    };
  }, [dispatch, accessToken]);

  return <FeedOrders orders={orders} variant="profile" />;
};

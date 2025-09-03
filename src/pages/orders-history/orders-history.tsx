import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks.ts';
import { useEffect } from 'react';

import { FeedOrders } from '@components/feed-orders/feed-orders.tsx';
import { PageOverlay } from '@components/page-overlay/page-overlay.tsx';
import {
  connectProfileOrders,
  disconnectProfileOrders,
} from '@services/slices/profileOrdersSlice.ts';

import type { RootState } from '@services/store.ts';
import type { FC } from 'react';

export const OrdersHistory: FC = () => {
  const { orders, status } = useAppSelector((state: RootState) => state.profileOrders);
  const accessToken = localStorage.getItem('accessToken') ?? '';

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!accessToken) return;

    const wsUrl = `wss://norma.nomoreparties.space/orders?token=${accessToken.replace('Bearer ', '')}`;
    dispatch(connectProfileOrders(wsUrl));

    return (): void => {
      dispatch(disconnectProfileOrders());
    };
  }, [dispatch, accessToken]);

  if (status === 'connecting') {
    return <PageOverlay />;
  }

  return <FeedOrders orders={orders} variant="profile" />;
};

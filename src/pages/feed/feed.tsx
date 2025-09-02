import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks.ts';
import { useEffect } from 'react';

import { FeedInfo } from '@components/feed-info/feed-info';
import { FeedOrders } from '@components/feed-orders/feed-orders';
import { PageOverlay } from '@components/page-overlay/page-overlay.tsx';
import { fetchOrders } from '@services/slices/feedSlice';

import type { RootState } from '@services/store';
import type { FC } from 'react';

import styles from './feed.module.css';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const {
    orders,
    loading: ordersLoading,
    total,
    totalToday,
  } = useAppSelector((state: RootState) => state.feed);

  useEffect(() => {
    const promise = dispatch(fetchOrders({}));
    return (): void => {
      promise.abort?.();
    };
  }, [dispatch]);

  if (ordersLoading) {
    return (
      <div className={styles.app}>
        <PageOverlay />
      </div>
    );
  }

  const doneOrders = orders.filter((o) => o.status === 'done').map((o) => o.number);
  const pendingOrders = orders
    .filter((o) => o.status === 'pending')
    .map((o) => o.number);

  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Лента заказов
      </h1>
      <div className={styles.wrapper}>
        <FeedOrders orders={orders} />
        <FeedInfo
          total={total}
          totalToday={totalToday}
          doneOrderNumbers={doneOrders}
          pendingOrderNumbers={pendingOrders}
        />
      </div>
    </>
  );
};

import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks.ts';
import { useEffect } from 'react';

import { FeedInfo } from '@components/feed-info/feed-info';
import { FeedOrders } from '@components/feed-orders/feed-orders';
import { PageOverlay } from '@components/page-overlay/page-overlay.tsx';
import { fetchOrders } from '@services/slices/feedSlice';
import { fetchIngredients } from '@services/slices/ingredientsSlice';

import type { RootState } from '@services/store';
import type { FC } from 'react';

import styles from './feed.module.css';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { ingredients, loading: ingredientsLoading } = useAppSelector(
    (state: RootState) => state.ingredients
  );
  const { orders, loading: ordersLoading } = useAppSelector(
    (state: RootState) => state.feed
  );
  const accessToken = localStorage.getItem('accessToken') ?? '';

  useEffect(() => {
    if (ingredients.length === 0) {
      const promise = dispatch(fetchIngredients());
      return (): void => {
        promise.abort?.();
      };
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    const promise = dispatch(fetchOrders({ accessToken }));
    return (): void => {
      promise.abort?.();
    };
  }, [dispatch, accessToken]);

  if (ingredientsLoading || ordersLoading || ingredients.length === 0) {
    return (
      <div className={styles.app}>
        <PageOverlay />
      </div>
    );
  }

  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Лента заказов
      </h1>
      <div className={styles.wrapper}>
        <FeedOrders orders={orders} />
        <FeedInfo />
      </div>
    </>
  );
};

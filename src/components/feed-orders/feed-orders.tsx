import { OrderItem } from '@components/feed-orders/order-item/order-item.tsx';

import type { TOrder } from '@utils/types.ts';
import type React from 'react';

import styles from './feed-orders.module.css';

type FeedOrdersProps = {
  orders: TOrder[];
};

export const FeedOrders: React.FC<FeedOrdersProps> = ({ orders }) => {
  return (
    <section className={styles.feed_orders}>
      <div className={`${styles.feed_orders_wrapper} custom-scroll pb-10`}>
        {orders.map((order) => (
          <OrderItem key={order._id} orderItem={order} />
        ))}
      </div>
    </section>
  );
};

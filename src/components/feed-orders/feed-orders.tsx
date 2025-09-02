import { OrderItem } from '@components/feed-orders/order-item/order-item.tsx';

import type { TOrder } from '@utils/types.ts';
import type React from 'react';

import styles from './feed-orders.module.css';

type OrderItemVariant = 'feed' | 'profile';

type FeedOrdersProps = {
  orders: TOrder[];
  variant?: OrderItemVariant;
};

export const FeedOrders: React.FC<FeedOrdersProps> = ({ orders, variant }) => {
  return (
    <section className={`${styles.feed_orders} custom-scroll`}>
      <div className={`${styles.feed_orders_wrapper} custom-scroll pb-10`}>
        {orders.map((order) => (
          <OrderItem key={order._id} orderItem={order} variant={variant} />
        ))}
      </div>
    </section>
  );
};

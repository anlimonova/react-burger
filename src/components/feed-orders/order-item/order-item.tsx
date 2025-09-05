import { useAppSelector } from '@/hooks/reduxHooks.ts';
import { FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { Price } from '@components/ui/price/price.tsx';
import { statusMap } from '@utils/types';

import type { RootState } from '@services/store';
import type { TOrder, TIngredient } from '@utils/types';
import type { FC } from 'react';

import styles from './order-item.module.css';

type OrderItemVariant = 'feed' | 'profile';

type IngredientItemProps = {
  orderItem: TOrder;
  variant?: OrderItemVariant;
};

export const OrderItem: FC<IngredientItemProps> = ({ orderItem, variant }) => {
  const ingredients = useAppSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  const orderIngredients: TIngredient[] = orderItem.ingredients
    .map((id) => ingredients?.find((ingredient) => ingredient._id === id))
    .filter(Boolean) as TIngredient[];

  const totalPrice = orderIngredients.reduce((sum, item) => sum + item.price, 0);

  return (
    <Link
      to={
        variant === 'profile'
          ? `/profile/orders/${orderItem.number}`
          : `/feed/${orderItem.number}`
      }
      state={{
        from: variant === 'profile' ? 'profile' : 'feed',
        backgroundPath: location.pathname,
      }}
      className={styles.link}
    >
      <div className={`${styles.orderItem} p-6`}>
        <div className={`${styles.top}`}>
          <span className={`text text_type_digits-default`}>#{orderItem.number}</span>
          <span className={`text text_type_main-default text_color_inactive`}>
            <FormattedDate date={new Date(orderItem.createdAt)} />
          </span>
        </div>

        <div className={`text text_type_main-medium mt-6`}>{orderItem.name}</div>

        {variant === 'profile' && (
          <div
            className={`${orderItem.status === 'done' ? styles.done : ''} text text_type_main-default mt-2`}
          >
            {statusMap[orderItem.status] ?? orderItem.status}
          </div>
        )}

        <div className={`${styles.bottom} mt-6`}>
          <div className={`${styles.images} pr-6`}>
            {orderIngredients.slice(0, 6).map((item, index) => (
              <div
                key={item._id + index}
                className={`${styles.imageContainer}`}
                style={{ zIndex: orderIngredients.length - index }}
              >
                <img
                  src={item.image_mobile}
                  alt={item.name}
                  className={`${styles.image}`}
                />
                {orderIngredients.length > 6 && index === 5 && (
                  <span className={`${styles.moreCount}`}>
                    +{orderIngredients.length - 6}
                  </span>
                )}
              </div>
            ))}
          </div>
          <Price price={totalPrice} />
        </div>
      </div>
    </Link>
  );
};

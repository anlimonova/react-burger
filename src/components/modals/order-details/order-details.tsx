import { useAppSelector } from '@/hooks/reduxHooks.ts';
import { useOrder } from '@/hooks/useOrder.ts';
import {
  FormattedDate,
  CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useMatch, useParams } from 'react-router-dom';

import { PageOverlay } from '@components/page-overlay/page-overlay.tsx';
import { Price } from '@components/ui/price/price.tsx';
import { statusMap, type TIngredient, type TOrder } from '@utils/types';

import type { RootState } from '@/services/store';
import type React from 'react';

import styles from './order-details.module.css';

type IngredientParams = {
  orderNumber?: string;
};

const isTOrder = (data: unknown): data is TOrder =>
  typeof data === 'object' &&
  data !== null &&
  '_id' in data &&
  'status' in data &&
  'name' in data &&
  'number' in data &&
  'ingredients' in data &&
  Array.isArray((data as TOrder).ingredients);

export const OrderDetails: React.FC<{ modal?: boolean; showTitle?: boolean }> = ({
  modal = false,
}) => {
  const { orderNumber } = useParams<IngredientParams>();
  const isProfileMatch = useMatch('/profile/orders/:orderNumber');

  const { modalData } = useAppSelector((state: RootState) => state.modal);
  const { ingredients } = useAppSelector((state: RootState) => state.ingredients);

  const { orders: feedOrders, status: feedStatus } = useAppSelector(
    (state: RootState) => state.feed
  );
  const { orders: profileOrders, status: profileStatus } = useAppSelector(
    (state: RootState) => state.profileOrders
  );

  const orders = isProfileMatch ? profileOrders : feedOrders;
  const status = isProfileMatch ? profileStatus : feedStatus;

  const orderFromHook = useOrder(orderNumber, orders);

  const order: TOrder | null = isTOrder(modalData) ? modalData : orderFromHook;

  if (status === 'connecting') {
    return (
      <div className={styles.app}>
        <PageOverlay />
      </div>
    );
  }

  if (!order) {
    return <div className="text text_type_main-default mt-10">Заказ не найден</div>;
  }

  const orderIngredientsMap: { ingredient: TIngredient; count: number }[] = [];
  const ingredientCountMap = new Map<
    string,
    { ingredient: TIngredient; count: number }
  >();

  for (const id of order.ingredients) {
    const ing = ingredients.find((i) => i._id === id);
    if (!ing) continue;

    const existing = ingredientCountMap.get(id);
    if (existing) {
      existing.count += 1;
    } else {
      ingredientCountMap.set(id, { ingredient: ing, count: 1 });
    }
  }

  orderIngredientsMap.push(...ingredientCountMap.values());

  const totalPrice = orderIngredientsMap.reduce(
    (sum, item) => sum + item.ingredient.price * item.count,
    0
  );

  return (
    <div className={`${styles.pageContent}`}>
      <h2 className={`${styles.title} text text_type_digits-default`}>
        #{order.number}
      </h2>
      {!modal && <span className="text text_type_digits-default">#{order.number}</span>}
      <div className="text text_type_main-medium mt-10">{order.name}</div>
      <div
        className={`${order.status === 'done' ? styles.done : ''} text text_type_main-default mt-3`}
      >
        {statusMap[order.status] ?? order.status}
      </div>

      <div className="text text_type_main-medium mt-15">Состав:</div>
      <div className={`${styles.ingredientsContainer} custom-scroll`}>
        {orderIngredientsMap.map(({ ingredient, count }, index) => (
          <div key={ingredient._id} className={`${styles.ingredient}`}>
            <div
              className={`${styles.imageContainer} mr-4`}
              style={{ zIndex: orderIngredientsMap.length - index }}
            >
              <img
                src={ingredient.image_mobile}
                alt={ingredient.name}
                className={`${styles.image}`}
              />
            </div>
            <p className={`${styles.name} text text_type_main-medium`}>
              {ingredient.name}
            </p>
            <div className={`${styles.ingredientPrice}`}>
              <span className="text text_type_digits-default">
                {count} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.bottom} mt-10`}>
        <span className="text text_type_main-default text_color_inactive">
          {<FormattedDate date={new Date(order.createdAt)} />}
        </span>
        <Price price={totalPrice} />
      </div>
    </div>
  );
};

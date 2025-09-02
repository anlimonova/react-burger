import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks.ts';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { PageOverlay } from '@components/page-overlay/page-overlay.tsx';
import { Price } from '@components/ui/price/price.tsx';
import { fetchOrders } from '@services/slices/feedSlice.ts';
import { formatRelativeDate } from '@utils/formatRelativeDate.ts';
import { statusMap, type TIngredient, type TOrder } from '@utils/types';

import type { RootState } from '@/services/store';
import type React from 'react';

import styles from './order-details.module.css';

type IngredientDetailsProps = {
  modal?: boolean;
};

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

export const OrderDetails: React.FC<IngredientDetailsProps> = ({ modal = false }) => {
  const { orderNumber } = useParams<IngredientParams>();
  const dispatch = useAppDispatch();

  const { modalData } = useAppSelector((state: RootState) => state.modal);
  const { ingredients } = useAppSelector((state: RootState) => state.ingredients);
  const { orders, loading: ordersLoading } = useAppSelector(
    (state: RootState) => state.feed
  );

  console.log(ordersLoading);

  useEffect(() => {
    if (orders.length === 0) {
      const promise = dispatch(fetchOrders({}));
      return (): void => {
        promise.abort?.();
      };
    }
  }, [dispatch, orders.length]);

  const order: TOrder | null = useMemo(() => {
    if (isTOrder(modalData)) return modalData;
    if (orderNumber) {
      return orders.find((ord) => String(ord.number) === orderNumber) ?? null;
    }
    return null;
  }, [modalData, orders, orderNumber]);

  if (ordersLoading) {
    return (
      <div className={`${styles.app}`}>
        <PageOverlay />
      </div>
    );
  }

  if (!order) {
    return <div className="text text_type_main-default mt-10">Заказ не найден</div>;
    // todo: добавить запрос по номеру заказа GET https://norma.nomoreparties.space/api/orders/{номер заказа}
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
    <div className={!modal ? styles.pageContent : undefined}>
      {!modal && <span className="text text_type_digits-default">#{order.number}</span>}
      <div className="text text_type_main-medium mt-10">{order.name}</div>
      <div
        className={`${order.status === 'done' ? styles.done : ''} text text_type_main-default mt-3`}
      >
        {statusMap[order.status] ?? order.status}
      </div>

      <div className="text text_type_main-medium mt-15">Состав:</div>
      <div className={`${styles.ingredientsContainer}`}>
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
            <p className="text text_type_main-medium mt-6">{ingredient.name}</p>
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
          {formatRelativeDate(order.createdAt)}
        </span>
        <Price price={totalPrice} />
      </div>
    </div>
  );
};

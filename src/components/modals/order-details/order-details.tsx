import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchOrderByNumber } from '@/services/slices/orderSlice';
import {
  FormattedDate,
  CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PageOverlay } from '@components/page-overlay/page-overlay.tsx';
import { Price } from '@components/ui/price/price.tsx';
import { statusMap, type TIngredient } from '@utils/types';

import type { RootState } from '@/services/store';
import type React from 'react';

import styles from './order-details.module.css';

type IngredientParams = { orderNumber?: string };

const isTOrder = (
  data: unknown
): data is {
  _id: string;
  name: string;
  number: number;
  status: string;
  ingredients: string[];
  createdAt: string;
} =>
  typeof data === 'object' &&
  data !== null &&
  '_id' in data &&
  'status' in data &&
  'name' in data &&
  'number' in data &&
  'ingredients' in data;

export const OrderDetails: React.FC<{ modal?: boolean; from?: string }> = ({
  modal = false,
}) => {
  const { orderNumber } = useParams<IngredientParams>();
  const dispatch = useAppDispatch();

  const { ingredients } = useAppSelector((state: RootState) => state.ingredients);
  const { orderByNumber, loading, error } = useAppSelector(
    (state: RootState) => state.order
  );
  const { orders: feedOrders } = useAppSelector((state: RootState) => state.feed);
  const { orders: profileOrders } = useAppSelector(
    (state: RootState) => state.profileOrders
  );
  const { modalData } = useAppSelector((state: RootState) => state.modal);

  const num = orderNumber ? Number(orderNumber) : null;
  const foundInFeed = num ? feedOrders.find((o) => o.number === num) : null;
  const foundInProfile = num ? profileOrders.find((o) => o.number === num) : null;
  const foundInOrderSlice = orderByNumber?.number === num ? orderByNumber : null;

  const order = isTOrder(modalData)
    ? modalData
    : (foundInFeed ?? foundInProfile ?? foundInOrderSlice);

  useEffect(() => {
    if (!num) return;

    if (!foundInFeed && !foundInProfile && !foundInOrderSlice) {
      void dispatch(fetchOrderByNumber({ orderNumber: num }));
    }
  }, [num, foundInFeed, foundInProfile, foundInOrderSlice, dispatch]);

  if (loading) return <PageOverlay />;
  if (error) return <div className="text text_type_main-default mt-10">{error}</div>;
  if (!order)
    return <div className="text text_type_main-default mt-10">Заказ не найден</div>;

  // построение ингредиентов
  const ingredientMap = new Map<string, { ingredient: TIngredient; count: number }>();
  for (const id of order.ingredients) {
    const ing = ingredients.find((i) => i._id === id);
    if (!ing) continue;
    const existing = ingredientMap.get(id);
    if (existing) existing.count += 1;
    else ingredientMap.set(id, { ingredient: ing, count: 1 });
  }

  const orderIngredients = Array.from(ingredientMap.values());
  const totalPrice = orderIngredients.reduce(
    (sum, item) => sum + item.ingredient.price * item.count,
    0
  );

  return (
    <div className={`${styles.content} ${!modal ? styles.page : ''}`}>
      <h2 className={`${styles.title} text text_type_digits-default`}>
        #{order.number}
      </h2>
      <div className="text text_type_main-medium mt-10">{order.name}</div>
      <div
        className={`${order.status === 'done' ? styles.done : ''} text text_type_main-default mt-3`}
      >
        {statusMap[order.status] ?? order.status}
      </div>

      <div className="text text_type_main-medium mt-15">Состав:</div>
      <div className={`${styles.ingredientsContainer} custom-scroll`}>
        {orderIngredients.map(({ ingredient, count }, idx) => (
          <div key={ingredient._id} className={styles.ingredient}>
            <div
              className={`${styles.imageContainer} mr-4`}
              style={{ zIndex: orderIngredients.length - idx }}
            >
              <img
                src={ingredient.image_mobile}
                alt={ingredient.name}
                className={styles.image}
              />
            </div>
            <p className={`${styles.name} text text_type_main-medium`}>
              {ingredient.name}
            </p>
            <div className={styles.ingredientPrice}>
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
          <FormattedDate date={new Date(order.createdAt)} />
        </span>
        <Price price={totalPrice} />
      </div>
    </div>
  );
};

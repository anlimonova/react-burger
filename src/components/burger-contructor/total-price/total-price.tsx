import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Modal } from '@components/modals/modal/modal';
import { OrderAccepting } from '@components/modals/order-accepting/order-accepting.tsx';
import { PageOverlay } from '@components/page-overlay/page-overlay';
import { Price } from '@components/ui/price/price';
import { modalSlice } from '@services/slices/modalSlice';
import { fetchOrderAccepting } from '@services/slices/orderSlice';
import { selectedIngredientsSlice } from '@services/slices/selectedIngredientsSlice';
import { isOrderModalData } from '@utils/typeGuards';

import type React from 'react';

import styles from './total-price.module.css';

export const TotalPrice = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((store) => store.user);
  const { modalType, modalData } = useAppSelector((state) => state.modal);
  const { bun, ingredients } = useAppSelector((state) => state.selectedIngredients);
  const { loading } = useAppSelector((state) => state.order);

  const totalPriceValue = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const handleClick = async (): Promise<void> => {
    if (!user) {
      void navigate('/login');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      void navigate('/login');
      return;
    }

    const ingredientIds = ingredients.map((item) => item._id);
    if (bun) {
      ingredientIds.unshift(bun._id);
      ingredientIds.push(bun._id);
    }

    const resultAction = await dispatch(
      fetchOrderAccepting({ ingredientIds, accessToken })
    );

    if (fetchOrderAccepting.fulfilled.match(resultAction)) {
      dispatch(
        modalSlice.actions.openModal({
          modalType: 'order',
          modalData: { idNumber: resultAction.payload?.order?.number },
        })
      );

      dispatch(selectedIngredientsSlice.actions.resetSelectedIngredients());
    }
  };

  return (
    <section className={`${styles['total-price']} pr-4 pt-10`}>
      <Price price={totalPriceValue} isLarge />
      <Button
        htmlType="button"
        type="primary"
        size="large"
        onClick={() => {
          void handleClick();
        }}
        disabled={!bun || ingredients.length === 0}
      >
        Оформить заказ
      </Button>

      {modalType === 'order' && isOrderModalData(modalData) && (
        <Modal onClose={() => dispatch(modalSlice.actions.closeModal())}>
          <OrderAccepting idNumber={modalData.idNumber} />
        </Modal>
      )}

      {loading && <PageOverlay />}
    </section>
  );
};

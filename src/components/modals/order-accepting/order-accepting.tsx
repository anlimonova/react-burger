import doneImage from '../../../images/done.jpg';

import type { FC } from 'react';

import styles from './order-accepting.module.css';

type OrderAcceptingProps = {
  idNumber: number;
};

export const OrderAccepting: FC<OrderAcceptingProps> = ({ idNumber }) => {
  return (
    <>
      <span className={`${styles['order-number']} text_type_digits-large mt-4`}>
        {idNumber}
      </span>
      <span className="text_type_main-medium mt-8">идентификатор заказа</span>
      <img
        className={`${styles['order-done-image']} mt-15 mb-15`}
        src={doneImage}
        alt="Готово"
        width={120}
        height={120}
      />
      <span className="text_type_main-default">Ваш заказ начали готовить</span>
      <span className={`${styles['text-grey']} text_type_main-default mt-2 mb-15`}>
        Дождитесь готовности на орбитальной станции
      </span>
    </>
  );
};

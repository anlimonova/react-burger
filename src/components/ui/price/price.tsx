import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import type { FC } from 'react';

import styles from './price.module.css';

type PriceProps = {
  price: number;
  isLarge?: boolean;
};

export const Price: FC<PriceProps> = ({ price, isLarge = false }) => {
  return (
    <span
      className={`text_type_digits-default ${styles['price-row']} ${
        isLarge ? styles['price-large'] : ''
      }`}
    >
      {price}
      <CurrencyIcon type="primary" />
    </span>
  );
};

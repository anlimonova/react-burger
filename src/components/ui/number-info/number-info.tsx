import type { FC } from 'react';

import styles from './number-info.module.css';

type NumberInfoProps = {
  title: string;
  number: number;
};

export const NumberInfo: FC<NumberInfoProps> = ({ title, number }) => {
  return (
    <div className={styles['number-info']}>
      <span className={'text_type_main-default'}>{title}</span>
      <span className={'text_type_digits-default mt-2'}>{number}</span>
    </div>
  );
};

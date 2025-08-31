import type { FC } from 'react';

import styles from './not-found-404.module.css';

export const NotFound404: FC = () => {
  return (
    <div className={`${styles.flex}`}>
      <p className="text text_type_main-large">404</p>
      <p className="text text_type_main-large mt-2">Страница не надена</p>
    </div>
  );
};

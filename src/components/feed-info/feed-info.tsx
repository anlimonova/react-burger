import type React from 'react';

import styles from './feed-info.module.css';

export const FeedInfo: React.FC = () => {
  return (
    <section className={`${styles.wrapper}`}>
      <div className={`${styles['order-numbers-wrapper']}`}>
        <div>
          <h4 className="text text_type_main-medium mb-6">Готовы:</h4>
          <ul className={`${styles['order-numbers']} ${styles.green}`}>
            <li>
              <span className="text text_type_main-medium">034533</span>
            </li>
            <li>
              <span className="text text_type_main-medium">034532</span>
            </li>
            <li>
              <span className="text text_type_main-medium">034530</span>
            </li>
            <li>
              <span className="text text_type_main-medium">034527</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text text_type_main-medium mb-6">В работе:</h4>
          <ul className={`${styles['order-numbers']}`}>
            <li>
              <span className="text text_type_main-medium">034538</span>
            </li>
            <li>
              <span className="text text_type_main-medium">034541</span>
            </li>
            <li>
              <span className="text text_type_main-medium">034542</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-15">
        <h4 className="text text_type_main-medium">Выполнено за все время:</h4>
        <span className={`${styles['big-number']} text_type_digits-large`}>28 752</span>
      </div>

      <div className="container mt-15">
        <h4 className="text text_type_main-medium">Выполнено за сегодня:</h4>
        <span className={`${styles['big-number']} text_type_digits-large`}>138</span>
      </div>
    </section>
  );
};

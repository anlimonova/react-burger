import { FeedNumberList } from '@components/feed-info/feed-number-list.tsx';

import type React from 'react';

import styles from './feed-info.module.css';

type FeedInfoProps = {
  total: number;
  totalToday: number;
  doneOrderNumbers: number[];
  pendingOrderNumbers: number[];
};

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export const FeedInfo: React.FC<FeedInfoProps> = ({
  total,
  totalToday,
  doneOrderNumbers,
  pendingOrderNumbers,
}) => {
  const doneChunks = chunkArray(doneOrderNumbers, 10);
  const pendingChunks = chunkArray(pendingOrderNumbers, 10);

  return (
    <section className={`${styles['feed-info']}`}>
      <div className={`${styles['feed-info-wrapper']}`}>
        <div className={`${styles['order-numbers-wrapper']}`}>
          <div className={`${styles['order-numbers-container']}`}>
            <h4 className="text text_type_main-medium mb-6">Готовы:</h4>
            {doneChunks.slice(0, 2).map((chunk, idx) => (
              <FeedNumberList key={idx} list={chunk} className={styles.green} />
            ))}
          </div>

          <div className={`${styles['order-numbers-container']}`}>
            <h4 className="text text_type_main-medium mb-6">В работе:</h4>
            {pendingChunks.slice(0, 2).map((chunk, idx) => (
              <FeedNumberList key={idx} list={chunk} />
            ))}
          </div>
        </div>

        <div className="container mt-15">
          <h4 className="text text_type_main-medium">Выполнено за все время:</h4>
          <span className={`${styles['big-number']} text_type_digits-large`}>
            {total}
          </span>
        </div>

        <div className="container mt-15">
          <h4 className="text text_type_main-medium">Выполнено за сегодня:</h4>
          <span className={`${styles['big-number']} text_type_digits-large`}>
            {totalToday}
          </span>
        </div>
      </div>
    </section>
  );
};

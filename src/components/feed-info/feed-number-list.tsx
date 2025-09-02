import type React from 'react';

import styles from '@components/feed-info/feed-info.module.css';

export const FeedNumberList: React.FC<{ list: number[]; className?: string }> = ({
  list,
  className,
}) => {
  const classes = [styles['order-numbers'], className].join(' ');
  return (
    <ul className={classes}>
      {list.map((number) => (
        <li key={number}>
          <span className="text text_type_digits-default">{number}</span>
        </li>
      ))}
    </ul>
  );
};

import { Preloader } from '@components/preloader/preloader';

import type { FC } from 'react';

import styles from './page-overlay.module.css';

export const PageOverlay: FC = () => (
  <div className={styles.overlay}>
    <Preloader />
  </div>
);

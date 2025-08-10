import React from 'react';
import styles from './page-overlay.module.css';
import { Preloader } from '@components/preloader/preloader';

export const PageOverlay = () => (
	<div className={styles.overlay}>
		<Preloader />
	</div>
);

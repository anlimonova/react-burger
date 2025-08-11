import type { FC } from 'react';

import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClose: () => void;
};

export const ModalOverlay: FC<ModalOverlayProps> = ({ onClose }) => {
  return <div className={styles['modal-overlay']} onClick={() => onClose()} />;
};

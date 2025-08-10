import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modals/modal-overlay/modal-overlay';

import type { ReactNode } from 'react';
import type React from 'react';

import styles from './modal.module.css';

type ModalProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

const modalRoot = document.getElementById('react-modals');

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return (): void => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!modalRoot) return null;

  return createPortal(
    <div className={styles['modal-wrapper']}>
      <div className={`${styles.modal} pl-10 pr-10 pb-15 pt-10`}>
        <header className={styles['modal-header']}>
          {title && <h2 className="text_type_main-large">{title}</h2>}
          <button
            className={`${styles['modal-close']} ml-9`}
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            <CloseIcon type="primary" />
          </button>
        </header>
        <div className={styles['modal-content']}>{children}</div>
      </div>
      <ModalOverlay onClose={onClose} />
    </div>,
    modalRoot
  );
};

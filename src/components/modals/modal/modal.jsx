import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './modal.module.css';
import * as PropTypes from 'prop-types';
import { ModalOverlay } from '@components/modals/modal-overlay/modal-overlay.jsx';
const modalRoot = document.getElementById('react-modals');

export const Modal = ({ title, onClose, children }) => {
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [onClose]);

	return createPortal(
		<div className={styles['modal-wrapper']}>
			<div className={styles['modal'] + ' pl-10 pr-10 pb-15 pt-10'}>
				<header className={styles['modal-header']}>
					{title && <h2 className='text_type_main-large'>{title}</h2>}
					<button
						className={styles['modal-close'] + ' ml-9'}
						onClick={onClose}
						aria-label='Закрыть модальное окно'>
						<CloseIcon type='primary' />
					</button>
				</header>
				<div className={styles['modal-content']}>{children}</div>
			</div>
			<ModalOverlay onClose={onClose} />
		</div>,
		modalRoot
	);
};

Modal.propTypes = {
	title: PropTypes.string,
	onClose: PropTypes.func.isRequired,
};

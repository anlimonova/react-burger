import React from 'react';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './modal.module.css';
import * as PropTypes from 'prop-types';

export const Modal = ({ title, label, onClose, children }) => {
	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<dialog
			className={styles['modal-overlay']}
			aria-modal='true'
			aria-label={title || label}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
			onKeyDown={(e) => {
				if (e.key === 'Escape') {
					onClose();
				}
			}}>
			<div className={styles['modal-wrapper'] + ' pl-10 pr-10 pb-15 pt-10'}>
				<header className={styles['modal-header']}>
					{title && <h2 className='text_type_main-large'>{title}</h2>}

					<button
						className={'ml-9'}
						onClick={onClose}
						aria-label='Закрыть модальное окно'>
						<CloseIcon type='primary' />
					</button>
				</header>
				<div className={styles['modal-content']}>{children}</div>
			</div>
		</dialog>
	);
};

Modal.propTypes = {
	title: PropTypes.string,
	label: PropTypes.string,
	onClose: PropTypes.func.isRequired,
};

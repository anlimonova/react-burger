import React, { useState } from 'react';
import styles from './total-price.module.css';
import * as PropTypes from 'prop-types';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Price } from '@components/ui/price/price.jsx';
import { Modal } from '@components/modals/modal/modal.jsx';
import { OrderDetails } from '@components/modals/order-details/order-details.jsx';

export const TotalPrice = ({ price }) => {
	const [isOrderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);

	const handleOrderDetailsOpenModal = () => {
		setOrderDetailsModalOpen(true);
	};

	const handleOrderDetailsCloseModal = () => {
		setOrderDetailsModalOpen(false);
	};

	return (
		<section className={styles['total-price'] + ' pr-4'}>
			<Price price={price} isLarge />
			<Button
				htmlType='button'
				type='primary'
				size='large'
				onClick={handleOrderDetailsOpenModal}>
				Оформить заказ
			</Button>
			{isOrderDetailsModalOpen && (
				<Modal onClose={handleOrderDetailsCloseModal}>
					<OrderDetails idNumber='034536' />
				</Modal>
			)}
		</section>
	);
};

TotalPrice.propTypes = {
	price: PropTypes.number.isRequired,
};

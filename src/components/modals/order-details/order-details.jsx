import React from 'react';
import styles from './order-details.module.css';
import * as PropTypes from 'prop-types';
import doneImage from '../../../images/done.jpg';

export const OrderDetails = ({ idNumber }) => {
	return (
		<>
			<span className={styles['order-number'] + ' text_type_digits-large mt-4'}>
				{idNumber}
			</span>
			<span className='text_type_main-medium mt-8'>идентификатор заказа</span>
			<img
				className={styles['order-done-image'] + ' mt-15 mb-15'}
				src={doneImage}
				alt=''
				width={120}
				height={120}
			/>
			<span className='text_type_main-default'>Ваш заказ начали готовить</span>
			<span
				className={styles['text-grey'] + ' text_type_main-default mt-2 mb-15'}>
				Дождитесь готовности на орбитальной станции
			</span>
		</>
	);
};

OrderDetails.propTypes = {
	idNumber: PropTypes.number.isRequired,
};

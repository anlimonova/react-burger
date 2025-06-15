import React from 'react';
import styles from './total-price.module.css';
import * as PropTypes from 'prop-types';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Price } from '@components/price/price.jsx';

export const TotalPrice = ({ price }) => {
	return (
		<section className={styles['total-price']}>
			<Price price={price} isLarge />
			<Button htmlType='button' type='primary' size='large'>
				Оформить заказ
			</Button>
		</section>
	);
};

TotalPrice.propTypes = {
	price: PropTypes.number.isRequired,
};

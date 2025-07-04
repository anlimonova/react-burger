import React from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './price.module.css';
import * as PropTypes from 'prop-types';

export const Price = ({ price, isLarge }) => {
	return (
		<span
			className={`text_type_digits-default ${styles['price-row']} ${isLarge && styles['price-large']}`}>
			{price}
			<CurrencyIcon type='primary' />
		</span>
	);
};

Price.propTypes = {
	price: PropTypes.number.isRequired,
	isLarge: PropTypes.bool,
};

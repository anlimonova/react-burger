import React from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ingredient-price.module.css';
import * as PropTypes from 'prop-types';

export const IngredientPrice = ({ price }) => {
	return (
		<span className={`text_type_digits-default ${styles['price-row']}`}>
			{price}
			<CurrencyIcon type='primary' />
		</span>
	);
};

IngredientPrice.propTypes = {
	price: PropTypes.number.isRequired,
};

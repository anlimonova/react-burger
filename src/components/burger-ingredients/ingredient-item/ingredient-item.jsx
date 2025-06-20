import React from 'react';
import styles from './ingredient-item.module.css';
import { ingredientPropType } from '@utils/prop-types.js';
import { Price } from '@components/ui/price/price.jsx';
import { Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import * as PropTypes from 'prop-types';

export const IngredientItem = ({ ingredient, onItemClick }) => {
	return (
		<button
			type={'button'}
			className={styles['ingredient-item']}
			onClick={() => onItemClick(ingredient)}>
			<Counter count={1} size='default' extraClass='m-1' />
			<img
				className={styles['ingredient-item__image'] + ' ml-4 mr-4'}
				src={ingredient.image_large}
				alt={ingredient.name}></img>
			<Price price={ingredient.price} />
			<span
				className={
					styles['ingredient-item__name'] + ' text text_type_main-default'
				}>
				{ingredient.name}
			</span>
		</button>
	);
};

IngredientItem.propTypes = {
	ingredient: ingredientPropType.isRequired,
	onItemClick: PropTypes.func.isRequired,
};

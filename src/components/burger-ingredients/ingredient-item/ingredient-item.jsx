import React from 'react';
import styles from './ingredient-item.module.css';
import { ingredientPropType } from '@utils/prop-types.js';
import { Price } from '@components/price/price.jsx';
import { Counter } from '@ya.praktikum/react-developer-burger-ui-components';

export const IngredientItem = ({ ingredient }) => {
	return (
		<div className={styles['ingredient-item']}>
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
		</div>
	);
};

IngredientItem.propTypes = {
	ingredient: ingredientPropType.isRequired,
};

import React from 'react';
import styles from './ingredient-item.module.css';
import { ingredientPropType } from '@utils/prop-types.js';
import { IngredientPrice } from '../ingredient-price/ingredient-price.jsx';

export const IngredientItem = ({ ingredient }) => {
	console.log(ingredient);

	return (
		<div className={styles['ingredient-item']}>
			<img
				className={styles['ingredient-item__image'] + ' ml-4 mr-4'}
				src={ingredient.image_large}
				alt={ingredient.name}></img>
			<IngredientPrice price={ingredient.price} />
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

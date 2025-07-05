import React from 'react';
import styles from './ingredient-item.module.css';
import { ingredientPropType } from '@utils/prop-types.js';
import { Price } from '@components/ui/price/price.jsx';
import { Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectedIngredientsSlice } from '@/services/slices/selectedIngredientsSlice.js';
import { modalSlice } from '@/services/slices/modalSlice.js';

export const IngredientItem = ({ ingredient }) => {
	const dispatch = useDispatch();
	const { bun, ingredients } = useSelector(
		(state) => state.selectedIngredients
	);

	const handleClick = () => {
		dispatch(
			modalSlice.actions.openModal({
				modalType: 'ingredient',
				modalData: ingredient,
			})
		);
		dispatch(selectedIngredientsSlice.actions.addIngredient(ingredient));
	};

	let count = 0;
	if (ingredient.type === 'bun') {
		if (bun && bun._id === ingredient._id) {
			count = 2;
		}
	} else {
		count = ingredients.filter((item) => item._id === ingredient._id).length;
	}

	return (
		<>
			<button
				type={'button'}
				className={styles['ingredient-item']}
				onClick={handleClick}>
				{count !== 0 && (
					<Counter count={count} size='default' extraClass='m-1' />
				)}
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
		</>
	);
};

IngredientItem.propTypes = {
	ingredient: ingredientPropType.isRequired,
};

import React, { useState } from 'react';
import styles from './ingredient-item.module.css';
import { ingredientPropType } from '@utils/prop-types.js';
import { Price } from '@components/ui/price/price.jsx';
import { Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import { IngredientDetails } from '@components/modals/ingredient-details/ingredient-details.jsx';
import { Modal } from '@components/modals/modal/modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectedIngredientsSlice } from '@/services/slices/selectedIngredientsSlice.js';

export const IngredientItem = ({ ingredient }) => {
	const [isIngredientModalOpen, setIngredientModalOpen] = useState(false);

	const { bun, ingredients } = useSelector(
		(state) => state.selectedIngredients
	);

	// const handleIngredientOpenModal = () => {
	// 	setIngredientModalOpen(true);
	// };

	const handleIngredientCloseModal = () => {
		setIngredientModalOpen(false);
	};

	const dispatch = useDispatch();

	const handleClick = () => {
		// dispatch(openModal({ type: 'ingredient', data: ingredient }));
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
			{isIngredientModalOpen && (
				<Modal
					title={'Детали ингредиента'}
					onClose={handleIngredientCloseModal}>
					<IngredientDetails ingredient={ingredient} />
				</Modal>
			)}
		</>
	);
};

IngredientItem.propTypes = {
	ingredient: ingredientPropType.isRequired,
};

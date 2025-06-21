import React, { useState } from 'react';
import styles from './ingredient-item.module.css';
import { ingredientPropType } from '@utils/prop-types.js';
import { Price } from '@components/ui/price/price.jsx';
import { Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import { IngredientDetails } from '@components/modals/ingredient-details/ingredient-details.jsx';
import { Modal } from '@components/modals/modal/modal.jsx';

export const IngredientItem = ({ ingredient }) => {
	const [isIngredientModalOpen, setIngredientModalOpen] = useState(false);

	const handleIngredientOpenModal = () => {
		setIngredientModalOpen(true);
	};

	const handleIngredientCloseModal = () => {
		setIngredientModalOpen(false);
	};

	return (
		<>
			<button
				type={'button'}
				className={styles['ingredient-item']}
				onClick={handleIngredientOpenModal}>
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

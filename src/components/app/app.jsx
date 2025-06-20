import React, { useState } from 'react';
import styles from './app.module.css';
import { ingredients } from '@utils/ingredients.js';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.jsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.jsx';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { IngredientModal } from '@components/modals/ingredient-modal/ingredient-modal.jsx';
import { Modal } from '@components/modals/modal/modal.jsx';

export const App = () => {
	const [selectedIngredient, setSelectedIngredient] = useState(null);
	const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);

	const handleIngredientOpenModal = (ingredient) => {
		setIsIngredientModalOpen(true);
		setSelectedIngredient(ingredient);
	};

	const handleIngredientCloseModal = () => {
		setIsIngredientModalOpen(false);
		setSelectedIngredient(null);
	};

	return (
		<div className={styles.app}>
			<AppHeader />
			<h1
				className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
				Соберите бургер
			</h1>
			<main className={`${styles.main} pl-5 pr-5`}>
				<BurgerIngredients
					ingredients={ingredients}
					onItemClick={handleIngredientOpenModal}
				/>
				<BurgerConstructor ingredients={ingredients} />
			</main>
			{isIngredientModalOpen && (
				<Modal
					title={'Детали ингредиента'}
					onClose={handleIngredientCloseModal}>
					<IngredientModal ingredient={selectedIngredient} />
				</Modal>
			)}
		</div>
	);
};

import React, { useEffect } from 'react';
import styles from './app.module.css';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.jsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.jsx';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { Preloader } from '@components/preloader/preloader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '@/services/slices/ingredientsSlice.js';
import { modalSlice } from '@/services/slices/modalSlice.js';
import { Modal } from '@components/modals/modal/modal.jsx';
import { IngredientDetails } from '@components/modals/ingredient-details/ingredient-details.jsx';

export const App = () => {
	const dispatch = useDispatch();
	const { ingredients, loading } = useSelector((state) => state.ingredients);
	const { modalType, modalData } = useSelector((state) => state.modal);

	useEffect(() => {
		const promise = dispatch(fetchIngredients());
		return () => {
			promise.abort();
		};
	}, [dispatch]);

	if (loading || ingredients.length === 0) {
		return (
			<div className={styles.app}>
				<Preloader />;
			</div>
		);
	}

	return (
		<div className={styles.app}>
			<AppHeader />
			<h1
				className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
				Соберите бургер
			</h1>
			<main className={`${styles.main} pl-5 pr-5`}>
				<BurgerIngredients ingredients={ingredients} />
				<BurgerConstructor />
			</main>
			{modalType === 'ingredient' && (
				<Modal
					title={'Детали ингредиента'}
					onClose={() => dispatch(modalSlice.actions.closeModal())}>
					<IngredientDetails ingredient={modalData} />
				</Modal>
			)}
		</div>
	);
};

import React, { useEffect } from 'react';
import styles from './app.module.css';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.jsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.jsx';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { Preloader } from '@components/preloader/preloader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '@/services/slices/ingredientsSlice.js';

export const App = () => {
	const ingredientsUrl = 'https://norma.nomoreparties.space/api/ingredients';
	const dispatch = useDispatch();
	const { ingredients, loading } = useSelector((state) => state.ingredients);

	useEffect(() => {
		const promise = dispatch(fetchIngredients(ingredientsUrl));
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
				<BurgerConstructor ingredients={ingredients} />
			</main>
		</div>
	);
};

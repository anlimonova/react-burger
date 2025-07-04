import React, { useState, useEffect } from 'react';
import styles from './app.module.css';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.jsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.jsx';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { Preloader } from '@components/preloader/preloader.jsx';

export const App = () => {
	const ingredientsUrl = 'https://norma.nomoreparties.space/api/ingredients';

	const [state, setState] = useState({
		ingredients: null,
		loading: true,
	});

	useEffect(() => {
		const controller = new AbortController();

		const getProductData = async () => {
			try {
				setState((prev) => ({ ...prev, loading: true }));

				const response = await fetch(ingredientsUrl, {
					signal: controller.signal,
				});
				if (!response.ok) {
					throw new Error(`Ошибка HTTP: ${response.status}`);
				}

				const json = await response.json();
				setState({ ingredients: json.data, loading: false });
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('Ошибка при загрузке данных по ингредиентам:', error);
					setState((prev) => ({ ...prev, loading: false }));
				}
			}
		};
		getProductData();

		return () => {
			controller.abort();
		};
	}, []);

	if (state.loading) {
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
				<BurgerIngredients ingredients={state.ingredients} />
				<BurgerConstructor ingredients={state.ingredients} />
			</main>
		</div>
	);
};

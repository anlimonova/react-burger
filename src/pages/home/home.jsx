import React, { useEffect } from 'react';
import styles from './home.module.css';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.jsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '@/services/slices/ingredientsSlice.js';
import { Preloader } from '@components/preloader/preloader.jsx';

export const Home = () => {
	const dispatch = useDispatch();
	const { ingredients, loading } = useSelector((state) => state.ingredients);

	useEffect(() => {
		const promise = dispatch(fetchIngredients());
		return () => {
			promise.abort();
		};
	}, [dispatch]);

	if (loading || ingredients.length === 0) {
		return (
			<div className={styles.app}>
				<Preloader />
			</div>
		);
	}
	return (
		<DndProvider backend={HTML5Backend}>
			<h1
				className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
				Соберите бургер
			</h1>
			<div className={styles.wrapper}>
				<BurgerIngredients />
				<BurgerConstructor />
			</div>
		</DndProvider>
	);
};

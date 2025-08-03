import React from 'react';
import styles from './home.module.css';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.jsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.jsx';

export const Home = () => {
	return (
		<>
			<h1
				className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
				Соберите бургер
			</h1>
			<div className={styles.wrapper}>
				<BurgerIngredients />
				<BurgerConstructor />
			</div>
		</>
	);
};

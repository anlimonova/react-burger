import React from 'react';
import styles from './burger-ingredients.module.css';
import * as PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { ingredientPropType } from '@utils/prop-types.js';
import { IngredientsGroup } from './ingredients-group/ingredients-group.jsx';

export const BurgerIngredients = ({ ingredients }) => {
	const filterIngredientsByType = (type) => {
		return ingredients.filter((ingredient) => ingredient.type === type);
	};

	const groups = [
		{
			id: 'bun',
			text: 'Булки',
		},
		{
			id: 'sauce',
			text: 'Соусы',
		},
		{
			id: 'main',
			text: 'Начинки',
		},
	];

	return (
		<section className={styles.burger_ingredients}>
			<nav>
				<ul className={styles.menu}>
					<Tab value='bun' active={true} onClick={() => {}}>
						Булки
					</Tab>
					<Tab value='main' active={false} onClick={() => {}}>
						Начинки
					</Tab>
					<Tab value='sauce' active={false} onClick={() => {}}>
						Соусы
					</Tab>
				</ul>
			</nav>
			<div className={styles.burger_ingredients_wrapper + ' custom-scroll'}>
				{groups.map((group, index) => (
					<IngredientsGroup
						key={index}
						title={group.text}
						ingredients={filterIngredientsByType(group.id)}></IngredientsGroup>
				))}
			</div>
		</section>
	);
};

BurgerIngredients.propTypes = {
	ingredients: PropTypes.arrayOf(ingredientPropType.isRequired).isRequired,
};

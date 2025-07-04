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

	const groups = {
		bun: 'Булки',
		sauce: 'Соусы',
		main: 'Начинки',
	};

	return (
		<section className={styles.burger_ingredients}>
			<nav>
				<ul className={styles.menu}>
					{Object.entries(groups).map(([id, title], index) => (
						<Tab key={id} value={id} active={index === 0} onClick={() => {}}>
							{title}
						</Tab>
					))}
				</ul>
			</nav>
			<div
				className={styles.burger_ingredients_wrapper + ' custom-scroll pb-10'}>
				{Object.entries(groups).map(([id, title]) => (
					<IngredientsGroup
						key={id}
						title={title}
						ingredients={filterIngredientsByType(id)}
					/>
				))}
			</div>
		</section>
	);
};

BurgerIngredients.propTypes = {
	ingredients: PropTypes.arrayOf(ingredientPropType.isRequired).isRequired,
};

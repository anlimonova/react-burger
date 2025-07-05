import React, { forwardRef } from 'react';
import styles from './ingredients-group.module.css';
import * as PropTypes from 'prop-types';
import { ingredientPropType } from '@utils/prop-types.js';
import { IngredientItem } from '../ingredient-item/ingredient-item.jsx';

export const IngredientsGroup = forwardRef(({ title, ingredients }, ref) => (
	<section className={'mt-10'} ref={ref}>
		<h2 className={'text_type_main-medium mb-6'}>{title}</h2>
		<ul className={styles['burger-ingredients-group__list'] + ' pl-4 pr-1'}>
			{ingredients.map((ingredientItem) => (
				<li key={ingredientItem._id}>
					<IngredientItem ingredient={ingredientItem} />
				</li>
			))}
		</ul>
	</section>
));

IngredientsGroup.propTypes = {
	title: PropTypes.string.isRequired,
	ingredients: PropTypes.arrayOf(ingredientPropType.isRequired).isRequired,
};

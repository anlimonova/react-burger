import React from 'react';
import styles from './ingredient-details.module.css';
import { ingredientPropType } from '@utils/prop-types.js';
import { NumberInfo } from '@components/ui/number-info/number-info.jsx';

export const IngredientDetails = ({ ingredient }) => {
	const info = {
		calories: 'Калории,ккал',
		proteins: 'Белки, г',
		fat: 'Жиры, г',
		carbohydrates: 'Углеводы, г',
	};

	return (
		<>
			<img
				className={'mb-4'}
				src={ingredient.image_large}
				alt={ingredient.name}
				width={480}
				height={240}
			/>
			<span className={'text_type_main-medium'}>{ingredient.name}</span>
			<div className={styles['nutrition-info'] + ' mt-8'}>
				{Object.entries(info).map(([key, title]) => (
					<NumberInfo key={key} title={title} number={ingredient[key]} />
				))}
			</div>
		</>
	);
};

IngredientDetails.propTypes = {
	ingredient: ingredientPropType.isRequired,
};

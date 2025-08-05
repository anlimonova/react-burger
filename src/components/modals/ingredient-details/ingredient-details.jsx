import React, { useEffect } from 'react';
import styles from './ingredient-details.module.css';
import { Preloader } from '@components/preloader/preloader.jsx';
import { NumberInfo } from '@components/ui/number-info/number-info.jsx';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '@/services/slices/ingredientsSlice.js';
import * as PropTypes from 'prop-types';

export const IngredientDetails = ({ modal = false }) => {
	const { ingredientId } = useParams();
	const dispatch = useDispatch();
	const { ingredients, loading } = useSelector((state) => state.ingredients);

	useEffect(() => {
		if (!modal && ingredients.length === 0) {
			dispatch(fetchIngredients());
		}
	}, [dispatch, ingredients.length, modal]);

	const { modalData } = useSelector((state) => state.modal);
	const ingredient =
		modalData || ingredients.find((ing) => ing._id === ingredientId);

	if (loading) return <Preloader />;
	if (!ingredient)
		return (
			<div className='text text_type_main-default'>Ингредиент не найден</div>
		);

	return (
		<div className={!modal && styles.pageContent}>
			{!modal && (
				<h1 className='text text_type_main-large mt-30'>Детали ингредиента</h1>
			)}
			<img
				className={'mb-4'}
				src={ingredient.image_large}
				alt={ingredient.name}
				width={480}
				height={240}
			/>
			<p className='text text_type_main-medium'>{ingredient.name}</p>
			<div className={styles['nutrition-info'] + ' mt-8'}>
				<NumberInfo title='Калории,ккал' number={ingredient.calories} />
				<NumberInfo title='Белки, г' number={ingredient.proteins} />
				<NumberInfo title='Жиры, г' number={ingredient.fat} />
				<NumberInfo title='Углеводы, г' number={ingredient.carbohydrates} />
			</div>
		</div>
	);
};

IngredientDetails.propTypes = {
	modal: PropTypes.bool,
};

import React from 'react';
import styles from './ingredient-item.module.css';
import { ingredientPropType } from '@utils/prop-types.js';
import { Price } from '@components/ui/price/price.jsx';
import { Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { modalSlice } from '@/services/slices/modalSlice.js';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

export const IngredientItem = ({ ingredient }) => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { bun, ingredients } = useSelector(
		(state) => state.selectedIngredients
	);

	const handleClick = () => {
		dispatch(
			modalSlice.actions.openModal({
				modalType: 'ingredient',
				modalData: ingredient,
			})
		);
	};

	let count = 0;
	if (ingredient.type === 'bun') {
		if (bun && bun._id === ingredient._id) {
			count = 2;
		}
	} else {
		count = ingredients.filter((item) => item._id === ingredient._id).length;
	}

	const isBunAlreadySelected =
		ingredient.type === 'bun' && bun && bun._id === ingredient._id;

	const [{ isDragging }, dragRef] = useDrag({
		type: 'ingredient',
		item: { id: ingredient._id, ingredient },
		canDrag: !isBunAlreadySelected,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	return (
		<Link
			to={`/ingredients/${ingredient._id}`}
			state={{ background: location }}
			className={styles.link}
			onClick={handleClick}
			ref={dragRef}
			style={{
				opacity: isDragging ? 0.5 : 1,
				cursor: isBunAlreadySelected ? 'not-allowed' : 'grab',
			}}>
			<div className={styles['ingredient-item']}>
				{count !== 0 && (
					<Counter count={count} size='default' extraClass='m-1' />
				)}
				<img
					className={styles['ingredient-item__image'] + ' ml-4 mr-4'}
					src={ingredient.image_large}
					alt={ingredient.name}></img>
				<Price price={ingredient.price} />
				<span
					className={
						styles['ingredient-item__name'] + ' text text_type_main-default'
					}>
					{ingredient.name}
				</span>
			</div>
		</Link>
	);
};

IngredientItem.propTypes = {
	ingredient: ingredientPropType.isRequired,
};

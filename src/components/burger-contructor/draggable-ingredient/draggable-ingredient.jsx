import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
	ConstructorElement,
	DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from '../burger-constructor.module.css';
import * as PropTypes from 'prop-types';
import { ingredientPropType } from '@utils/prop-types.js';
import { useDispatch } from 'react-redux';
import { selectedIngredientsSlice } from '@/services/slices/selectedIngredientsSlice';

export const DraggableIngredient = ({ ingredient, index, moveIngredient }) => {
	const dispatch = useDispatch();
	const ref = useRef(null);

	const [{ isDragging }, dragRef] = useDrag({
		type: 'filling',
		item: { index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const [, dropRef] = useDrop({
		accept: 'filling',
		hover(draggedItem) {
			if (draggedItem.index === index) return;
			moveIngredient(draggedItem.index, index);
			draggedItem.index = index;
		},
	});

	dragRef(dropRef(ref));

	return (
		<li ref={ref} className={'pl-8'} style={{ opacity: isDragging ? 0.5 : 1 }}>
			<button className={styles.ingredient_drag} type={'button'}>
				<DragIcon type='primary' />
			</button>
			<ConstructorElement
				text={ingredient.name}
				price={ingredient.price}
				thumbnail={ingredient.image}
				handleClose={() =>
					dispatch(
						selectedIngredientsSlice.actions.removeIngredient(ingredient.uuid)
					)
				}
			/>
		</li>
	);
};

DraggableIngredient.propTypes = {
	ingredient: ingredientPropType.isRequired,
	index: PropTypes.number.isRequired,
	moveIngredient: PropTypes.func.isRequired,
};

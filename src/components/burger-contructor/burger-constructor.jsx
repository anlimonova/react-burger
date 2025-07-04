import React from 'react';
import styles from './burger-constructor.module.css';
import {
	ConstructorElement,
	DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { TotalPrice } from './total-price/total-price.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectedIngredientsSlice } from '@/services/slices/selectedIngredientsSlice.js';

export const BurgerConstructor = () => {
	const { bun, ingredients } = useSelector(
		(state) => state.selectedIngredients
	);

	const dispatch = useDispatch();

	return (
		<section className={styles.burger_constructor}>
			<div className={styles.burger_constructor_ingredients + ' pl-8 pr-4'}>
				{bun && (
					<ConstructorElement
						type='top'
						isLocked={true}
						text={`${bun.name} (верх)`}
						price={bun.price}
						thumbnail={bun.image}
					/>
				)}
				<ul
					className={
						styles.burger_constructor_filling + ' custom-scroll mt-4 mb-4'
					}>
					{ingredients.length > 0 &&
						ingredients.map((item, index) => (
							<li key={item._id + index} className={'pl-8'}>
								<button className={styles.ingredient_drag} type={'button'}>
									<DragIcon type='primary' />
								</button>
								<ConstructorElement
									text={item.name}
									price={item.price}
									thumbnail={item.image}
									handleClose={() =>
										dispatch(
											selectedIngredientsSlice.actions.removeIngredient(
												item.uuid
											)
										)
									}
								/>
							</li>
						))}
				</ul>
				{bun && (
					<ConstructorElement
						type='bottom'
						isLocked={true}
						text={`${bun.name} (низ)`}
						price={bun.price}
						thumbnail={bun.image}
					/>
				)}
			</div>
			<TotalPrice price={610} />
		</section>
	);
};

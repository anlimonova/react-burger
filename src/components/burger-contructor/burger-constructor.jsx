import React from 'react';
import styles from './burger-constructor.module.css';
import { ConstructorElement } from '@ya.praktikum/react-developer-burger-ui-components';
import { TotalPrice } from './total-price/total-price.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectedIngredientsSlice } from '@/services/slices/selectedIngredientsSlice.js';
import { useDrop } from 'react-dnd';
import { DraggableIngredient } from './draggable-ingredient/draggable-ingredient';

export const BurgerConstructor = () => {
	const { bun, ingredients } = useSelector(
		(state) => state.selectedIngredients
	);

	const dispatch = useDispatch();

	const [, dropRef] = useDrop({
		accept: 'ingredient',
		drop: (item) => {
			dispatch(selectedIngredientsSlice.actions.addIngredient(item.ingredient));
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	});

	const moveIngredient = (fromIndex, toIndex) => {
		dispatch(
			selectedIngredientsSlice.actions.reorderIngredients({
				fromIndex,
				toIndex,
			})
		);
	};

	return (
		<section className={styles.burger_constructor}>
			<div
				className={styles.burger_constructor_ingredients + ' pl-8 pr-4'}
				ref={dropRef}>
				<div className={styles['burger-constructor_drop-zone-top']}>
					{!bun && (
						<span className={'text text_type_main-default'}>
							Выберите булки
						</span>
					)}
					{bun && (
						<ConstructorElement
							type='top'
							isLocked={true}
							text={`${bun.name} (верх)`}
							price={bun.price}
							thumbnail={bun.image}
						/>
					)}
				</div>
				<ul
					className={
						styles.burger_constructor_filling + ' custom-scroll mt-4 mb-4'
					}>
					{ingredients.length === 0 && (
						<div className={styles['burger-constructor_drop-zone-middle']}>
							<span className={'text text_type_main-default'}>
								Выберите начинку
							</span>
						</div>
					)}
					{ingredients.length > 0 &&
						ingredients.map((item, index) => (
							<DraggableIngredient
								key={item.uuid}
								ingredient={item}
								index={index}
								moveIngredient={moveIngredient}
							/>
						))}
				</ul>
				<div className={styles['burger-constructor_drop-zone-bottom']}>
					{!bun && (
						<span className={'text text_type_main-default'}>
							Выберите булки
						</span>
					)}
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
			</div>
			<TotalPrice />
		</section>
	);
};

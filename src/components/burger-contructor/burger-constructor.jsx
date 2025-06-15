import React from 'react';
import styles from './burger-constructor.module.css';
import * as PropTypes from 'prop-types';
import { ingredientPropType } from '@utils/prop-types.js';
import {
	ConstructorElement,
	DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { TotalPrice } from './total-price/total-price.jsx';

export const BurgerConstructor = ({ ingredients }) => {
	const bun = ingredients.find((item) => item.type === 'bun');
	const sauce = ingredients.find((item) => item.type === 'sauce');
	const main = ingredients.filter((item) => item.type === 'main');

	return (
		<section className={styles.burger_constructor}>
			<div className={styles.burger_constructor_ingredients + ' pl-8'}>
				<ConstructorElement
					className={'ml-8'}
					type='top'
					isLocked={true}
					text={`${bun.name} (верх)`}
					price={bun.price}
					thumbnail={bun.image}
				/>
				<ul
					className={
						styles.burger_constructor_filling + ' custom-scroll mt-4 mb-4'
					}>
					<li key={sauce._id} className={'pl-8'}>
						<button className={styles.ingredient_drag} type={'button'}>
							<DragIcon type='primary' />
						</button>
						<ConstructorElement
							text={sauce.name}
							price={sauce.price}
							thumbnail={sauce.image}
						/>
					</li>
					{main.map((item) => (
						<li key={item._id} className={'pl-8'}>
							<button className={styles.ingredient_drag} type={'button'}>
								<DragIcon type='primary' />
							</button>
							<ConstructorElement
								className={'ml-8'}
								text={item.name}
								price={item.price}
								thumbnail={item.image}
							/>
						</li>
					))}
				</ul>
				<ConstructorElement
					type='bottom'
					isLocked={true}
					text={`${bun.name} (низ)`}
					price={bun.price}
					thumbnail={bun.image}
				/>
			</div>
			<TotalPrice price={610} />
		</section>
	);
};

BurgerConstructor.propTypes = {
	ingredients: PropTypes.arrayOf(ingredientPropType.isRequired).isRequired,
};

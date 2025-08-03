import React, { useRef, useState } from 'react';
import styles from './burger-ingredients.module.css';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { IngredientsGroup } from './ingredients-group/ingredients-group.jsx';
import { useSelector } from 'react-redux';

export const BurgerIngredients = () => {
	const { ingredients } = useSelector((state) => state.ingredients);

	const filterIngredientsByType = (type) => {
		return ingredients.filter((ingredient) => ingredient.type === type);
	};

	const [activeTab, setActiveTab] = useState('bun');

	const wrapperRef = useRef(null);
	const bunRef = useRef(null);
	const sauceRef = useRef(null);
	const mainRef = useRef(null);

	const groups = {
		bun: { title: 'Булки', ref: bunRef },
		sauce: { title: 'Соусы', ref: sauceRef },
		main: { title: 'Начинки', ref: mainRef },
	};

	const handleScroll = () => {
		if (!wrapperRef.current) return;

		const offsets = Object.entries(groups).map(([key, { ref }]) => {
			if (!ref.current) return { key, offset: Infinity };
			return {
				key,
				offset: Math.abs(
					ref.current.getBoundingClientRect().top -
						wrapperRef.current.getBoundingClientRect().top
				),
			};
		});

		const closest = offsets.reduce((prev, curr) =>
			curr.offset < prev.offset ? curr : prev
		);

		setActiveTab(closest.key);
	};

	const handleTabClick = (key) => {
		const sectionRef = groups[key].ref;
		sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
		setActiveTab(key);
	};

	return (
		<section className={styles.burger_ingredients}>
			<nav>
				<ul className={styles.menu}>
					{Object.entries(groups).map(([id, { title }]) => (
						<Tab
							key={id}
							value={id}
							active={activeTab === id}
							onClick={() => {
								handleTabClick(id);
							}}>
							{title}
						</Tab>
					))}
				</ul>
			</nav>
			<div
				ref={wrapperRef}
				className={styles.burger_ingredients_wrapper + ' custom-scroll pb-10'}
				onScroll={handleScroll}>
				{Object.entries(groups).map(([id, { title, ref }]) => (
					<IngredientsGroup
						key={id}
						title={title}
						ingredients={filterIngredientsByType(id)}
						ref={ref}
					/>
				))}
			</div>
		</section>
	);
};

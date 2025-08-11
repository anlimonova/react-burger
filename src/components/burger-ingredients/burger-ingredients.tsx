import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { IngredientsGroup } from './ingredients-group/ingredients-group';

import type { RootState } from '@services/store';
import type { TIngredient } from '@utils/types';
import type React from 'react';

import styles from './burger-ingredients.module.css';

type IngredientType = 'bun' | 'sauce' | 'main';

type Group = {
  title: string;
  ref: React.RefObject<HTMLElement | null>;
};

export const BurgerIngredients: React.FC = () => {
  const { ingredients } = useSelector((state: RootState) => state.ingredients);

  const filterIngredientsByType = (type: IngredientType): TIngredient[] => {
    return ingredients.filter((ingredient) => ingredient.type === type);
  };

  const [activeTab, setActiveTab] = useState<IngredientType>('bun');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLElement | null>(null);
  const sauceRef = useRef<HTMLElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  const groups: Record<IngredientType, Group> = {
    bun: { title: 'Булки', ref: bunRef },
    sauce: { title: 'Соусы', ref: sauceRef },
    main: { title: 'Начинки', ref: mainRef },
  };

  const handleScroll = (): void => {
    if (!wrapperRef.current) return;

    const wrapperTop = wrapperRef.current.getBoundingClientRect().top;

    const offsets = (Object.entries(groups) as [IngredientType, Group][]).map(
      ([key, { ref }]) => {
        if (!ref.current) return { key, offset: Infinity };
        return {
          key,
          offset: Math.abs(ref.current.getBoundingClientRect().top - wrapperTop),
        };
      }
    );

    const closest = offsets.reduce((prev, curr) =>
      curr.offset < prev.offset ? curr : prev
    );

    setActiveTab(closest.key);
  };

  const handleTabClick = (key: IngredientType): void => {
    const sectionRef = groups[key].ref;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab(key);
  };

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          {(Object.entries(groups) as [IngredientType, Group][]).map(
            ([id, { title }]) => (
              <Tab
                key={id}
                value={id}
                active={activeTab === id}
                onClick={() => {
                  handleTabClick(id);
                }}
              >
                {title}
              </Tab>
            )
          )}
        </ul>
      </nav>
      <div
        ref={wrapperRef}
        className={`${styles.burger_ingredients_wrapper} custom-scroll pb-10`}
        onScroll={handleScroll}
      >
        {(Object.entries(groups) as [IngredientType, Group][]).map(
          ([id, { title, ref }]) => (
            <IngredientsGroup
              key={id}
              title={title}
              ingredients={filterIngredientsByType(id)}
              ref={ref}
            />
          )
        )}
      </div>
    </section>
  );
};

import { forwardRef } from 'react';

import { IngredientItem } from '../ingredient-item/ingredient-item';

import type { TIngredient } from '@utils/types';
import type { Ref } from 'react';

import styles from './ingredients-group.module.css';

type IngredientsGroupProps = {
  title: string;
  ingredients: TIngredient[];
};

export const IngredientsGroup = forwardRef<HTMLElement, IngredientsGroupProps>(
  ({ title, ingredients }, ref: Ref<HTMLElement>) => (
    <section className="mt-10" ref={ref}>
      <h2 className="text_type_main-medium mb-6">{title}</h2>
      <ul className={styles['burger-ingredients-group__list'] + ' pl-4 pr-1'}>
        {ingredients.map((ingredientItem) => (
          <li key={ingredientItem._id}>
            <IngredientItem ingredient={ingredientItem} />
          </li>
        ))}
      </ul>
    </section>
  )
);

IngredientsGroup.displayName = 'IngredientsGroup';

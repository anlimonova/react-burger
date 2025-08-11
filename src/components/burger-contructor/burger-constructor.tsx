import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { ConstructorElement } from '@ya.praktikum/react-developer-burger-ui-components';
import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { DraggableIngredient } from './draggable-ingredient/draggable-ingredient';
import { TotalPrice } from './total-price/total-price';
import { selectedIngredientsSlice } from '@services/slices/selectedIngredientsSlice';

import type { TIngredientWithUUID } from '@utils/types';
import type React from 'react';

import styles from './burger-constructor.module.css';

type DragItem = {
  ingredient: TIngredientWithUUID;
  type: string;
};

export const BurgerConstructor: React.FC = () => {
  const { bun, ingredients } = useAppSelector((state) => state.selectedIngredients);
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop<DragItem>({
    accept: 'ingredient',
    drop: (item) => {
      dispatch(selectedIngredientsSlice.actions.addIngredient(item.ingredient));
    },
  });

  useEffect(() => {
    if (containerRef.current) {
      drop(containerRef.current);
    }
  }, [drop]);

  const moveIngredient = (fromIndex: number, toIndex: number): void => {
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
        className={`${styles.burger_constructor_ingredients} pl-8 pr-4`}
        ref={containerRef}
      >
        <div className={styles['burger-constructor_drop-zone-top']}>
          {!bun && <span className="text text_type_main-default">Выберите булки</span>}
          {bun && (
            <ConstructorElement
              type="top"
              isLocked
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          )}
        </div>

        <ul className={`${styles.burger_constructor_filling} custom-scroll mt-4 mb-4`}>
          {ingredients.length === 0 && (
            <div className={styles['burger-constructor_drop-zone-middle']}>
              <span className="text text_type_main-default">Выберите начинку</span>
            </div>
          )}
          {ingredients.map((item, index) => (
            <DraggableIngredient
              key={item.uuid}
              ingredient={item}
              index={index}
              moveIngredient={moveIngredient}
            />
          ))}
        </ul>

        <div className={styles['burger-constructor_drop-zone-bottom']}>
          {!bun && <span className="text text_type_main-default">Выберите булки</span>}
          {bun && (
            <ConstructorElement
              type="bottom"
              isLocked
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

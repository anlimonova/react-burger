import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchIngredients } from '@/services/slices/ingredientsSlice';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-contructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { PageOverlay } from '@components/page-overlay/page-overlay';

import type { FC } from 'react';

import styles from './home.module.css';

export const Home: FC = () => {
  const dispatch = useAppDispatch();
  const { ingredients, loading } = useAppSelector((state) => state.ingredients);

  useEffect((): void | (() => void) => {
    const promise = dispatch(fetchIngredients());

    return () => {
      promise.abort();
    };
  }, [dispatch]);

  if (loading || ingredients.length === 0) {
    return (
      <div className={styles.app}>
        <PageOverlay />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <div className={styles.wrapper}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </DndProvider>
  );
};

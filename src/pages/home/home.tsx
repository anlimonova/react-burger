import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-contructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { FC } from 'react';

import styles from './home.module.css';

export const Home: FC = () => {
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

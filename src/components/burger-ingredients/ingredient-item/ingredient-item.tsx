import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import React from 'react';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import { Price } from '@components/ui/price/price';
import { modalSlice } from '@services/slices/modalSlice';

import type { RootState } from '@services/store';
import type { TIngredient } from '@utils/types';
import type { FC } from 'react';

import styles from './ingredient-item.module.css';

type IngredientItemProps = {
  ingredient: TIngredient;
};

export const IngredientItem: FC<IngredientItemProps> = ({ ingredient }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { bun, ingredients } = useAppSelector(
    (state: RootState) => state.selectedIngredients
  );

  const handleClick = (): void => {
    dispatch(
      modalSlice.actions.openModal({
        modalType: 'ingredient',
        modalData: ingredient,
      })
    );
  };

  let count = 0;
  if (ingredient.type === 'bun') {
    if (bun && bun._id === ingredient._id) {
      count = 2;
    }
  } else {
    count = ingredients.filter((item) => item._id === ingredient._id).length;
  }

  const isBunAlreadySelected =
    ingredient.type === 'bun' && bun && bun._id === ingredient._id;

  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: { id: ingredient._id, ingredient },
    canDrag: !isBunAlreadySelected,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  React.useEffect(() => {
    if (ref.current) {
      dragRef(ref.current);
    }
  }, [dragRef]);

  return (
    <Link
      to={`/ingredients/${ingredient._id}`}
      state={{ backgroundPath: location.pathname }}
      className={styles.link}
      onClick={handleClick}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isBunAlreadySelected ? 'not-allowed' : 'grab',
      }}
    >
      <div className={styles['ingredient-item']} ref={ref}>
        {count !== 0 && <Counter count={count} size="default" extraClass="m-1" />}
        <img
          className={styles['ingredient-item__image'] + ' ml-4 mr-4'}
          src={ingredient.image_large}
          alt={ingredient.name}
        />
        <Price price={ingredient.price} />
        <span
          className={styles['ingredient-item__name'] + ' text text_type_main-default'}
        >
          {ingredient.name}
        </span>
      </div>
    </Link>
  );
};

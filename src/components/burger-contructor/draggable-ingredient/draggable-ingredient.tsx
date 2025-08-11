import { useAppDispatch } from '@/hooks/reduxHooks.ts';
import { selectedIngredientsSlice } from '@/services/slices/selectedIngredientsSlice';
import {
  ConstructorElement,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { TIngredientWithUUID } from '@utils/types';
import type { FC } from 'react';

import styles from '../burger-constructor.module.css';

type DraggableIngredientProps = {
  ingredient: TIngredientWithUUID;
  index: number;
  moveIngredient: (dragIndex: number, hoverIndex: number) => void;
};

type DragItem = {
  index: number;
  type: string;
};

export const DraggableIngredient: FC<DraggableIngredientProps> = ({
  ingredient,
  index,
  moveIngredient,
}) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'filling',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop<DragItem>({
    accept: 'filling',
    hover: (draggedItem) => {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveIngredient(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  dragRef(dropRef(ref));

  return (
    <li ref={ref} className="pl-8" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <button className={styles.ingredient_drag} type="button">
        <DragIcon type="primary" />
      </button>
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() =>
          dispatch(selectedIngredientsSlice.actions.removeIngredient(ingredient.uuid))
        }
      />
    </li>
  );
};

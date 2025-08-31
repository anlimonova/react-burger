import { useAppDispatch } from '@/hooks/reduxHooks.ts';
import { fetchIngredients } from '@/services/slices/ingredientsSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { PageOverlay } from '@components/page-overlay/page-overlay';
import { NumberInfo } from '@components/ui/number-info/number-info';

import type { RootState } from '@/services/store';
import type { TIngredient } from '@utils/types';
import type React from 'react';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = {
  modal?: boolean;
};

type IngredientParams = {
  ingredientId?: string;
};

export const IngredientDetails: React.FC<IngredientDetailsProps> = ({
  modal = false,
}) => {
  const { ingredientId } = useParams<IngredientParams>();
  const dispatch = useAppDispatch();

  const { ingredients, loading } = useSelector((state: RootState) => state.ingredients);
  const { modalData } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    if (!modal && ingredients.length === 0) {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, modal]);

  const ingredient: TIngredient | null =
    (modalData as TIngredient) ||
    ingredients.find((ing) => ing._id === ingredientId) ||
    null;

  if (loading) return <PageOverlay />;
  if (!ingredient)
    return <div className="text text_type_main-default">Ингредиент не найден</div>;

  return (
    <div className={!modal ? styles.pageContent : undefined}>
      {!modal && <h1 className="text text_type_main-large mt-30">Детали ингредиента</h1>}
      <img
        className="mb-4"
        src={ingredient.image_large}
        alt={ingredient.name}
        width={480}
        height={240}
      />
      <p className="text text_type_main-medium">{ingredient.name}</p>
      <div className={`${styles['nutrition-info']} mt-8`}>
        <NumberInfo title="Калории,ккал" number={ingredient.calories} />
        <NumberInfo title="Белки, г" number={ingredient.proteins} />
        <NumberInfo title="Жиры, г" number={ingredient.fat} />
        <NumberInfo title="Углеводы, г" number={ingredient.carbohydrates} />
      </div>
    </div>
  );
};

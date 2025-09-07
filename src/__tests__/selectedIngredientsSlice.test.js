import {
  selectedIngredientsSlice,
  initialState,
} from '@/services/slices/selectedIngredientsSlice';
import { saveToSession, SELECTED_INGREDIENTS_KEY } from '@/utils/session';
import jest from 'jest';
import { v4 as uuidv4 } from 'uuid';

import { expectUnchangedExcept } from '@utils/expectUnchangedExcept.ts';

jest.mock('@/utils/session', () => ({
  saveToSession: jest.fn(),
  loadFromSession: jest.fn(() => null),
  SELECTED_INGREDIENTS_KEY: 'selectedIngredients',
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { addIngredient, removeIngredient, resetSelectedIngredients, reorderIngredients } =
  selectedIngredientsSlice.actions;

describe('selectedIngredientsSlice', () => {
  const reducer = selectedIngredientsSlice.reducer;
  const getInitialState = () => reducer(undefined, { type: '@@INIT' });
  const shape = ['bun', 'ingredients'].sort();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('начальное состояние корректно и содержит все поля', () => {
    const state = getInitialState();
    expect(state).toEqual(initialState);
    expect(Object.keys(state).sort()).toEqual(shape);
  });

  test('addIngredient: bun-ингредиент устанавливается в bun, остальные поля не меняются', () => {
    uuidv4.mockReturnValueOnce('uuid-1');
    const prev = getInitialState();
    const bunIngredient = { _id: 'b1', name: 'Булка', type: 'bun', price: 10 };

    const next = reducer(prev, addIngredient(bunIngredient));

    expectUnchangedExcept(prev, next, { bun: { ...bunIngredient, uuid: 'uuid-1' } });
    expect(Object.keys(next).sort()).toEqual(shape);

    expect(saveToSession).toHaveBeenCalledTimes(1);
    const calls = saveToSession.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(SELECTED_INGREDIENTS_KEY);
    expect(calls[0][1]).not.toBeNull();
    expect(typeof calls[0][1]).toBe('object');
  });

  test('addIngredient: обычный ингредиент добавляется в массив, bun не меняется', () => {
    uuidv4.mockReturnValueOnce('uuid-2');
    const prev = getInitialState();
    const sauce = { _id: 's1', name: 'Соус', type: 'sauce', price: 5 };

    const next = reducer(prev, addIngredient(sauce));

    expectUnchangedExcept(prev, next, { ingredients: [{ ...sauce, uuid: 'uuid-2' }] });
    expect(Object.keys(next).sort()).toEqual(shape);

    expect(saveToSession).toHaveBeenCalledTimes(1);
    const calls = saveToSession.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(SELECTED_INGREDIENTS_KEY);
    expect(calls[0][1]).not.toBeNull();
    expect(typeof calls[0][1]).toBe('object');
  });

  test('removeIngredient: удаляет по uuid только из ingredients, bun не меняется', () => {
    uuidv4.mockReturnValueOnce('u-1').mockReturnValueOnce('u-2');
    const base = getInitialState();
    const filled = [
      addIngredient({ _id: 'i1', name: 'A', type: 'main', price: 1 }),
      addIngredient({ _id: 'i2', name: 'B', type: 'main', price: 2 }),
    ].reduce((s, a) => reducer(s, a), base);

    jest.clearAllMocks();

    const next = reducer(filled, removeIngredient('u-1'));

    expectUnchangedExcept(filled, next, {
      ingredients: [{ _id: 'i2', name: 'B', type: 'main', price: 2, uuid: 'u-2' }],
    });
    expect(Object.keys(next).sort()).toEqual(shape);

    expect(saveToSession).toHaveBeenCalledTimes(1);
    const calls = saveToSession.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(SELECTED_INGREDIENTS_KEY);
    expect(calls[0][1]).not.toBeNull();
    expect(typeof calls[0][1]).toBe('object');
  });

  test('resetSelectedIngredients: очищает bun и ingredients', () => {
    uuidv4.mockReturnValueOnce('bun-u').mockReturnValueOnce('ing-u');
    const base = getInitialState();
    const opened = reducer(
      base,
      addIngredient({ _id: 'b', name: 'Булка', type: 'bun', price: 10 })
    );
    const withIngredient = reducer(
      opened,
      addIngredient({ _id: 'x', name: 'X', type: 'main', price: 3 })
    );

    jest.clearAllMocks();

    const next = reducer(withIngredient, resetSelectedIngredients());

    expectUnchangedExcept(withIngredient, next, { bun: null, ingredients: [] });
    expect(Object.keys(next).sort()).toEqual(shape);

    expect(saveToSession).toHaveBeenCalledTimes(1);
    const calls = saveToSession.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(SELECTED_INGREDIENTS_KEY);
    expect(calls[0][1]).not.toBeNull();
    expect(typeof calls[0][1]).toBe('object');
  });

  test('reorderIngredients: меняет порядок только в ingredients, bun не меняется', () => {
    uuidv4.mockReturnValueOnce('u1').mockReturnValueOnce('u2').mockReturnValueOnce('u3');
    const base = getInitialState();
    const filled = [
      addIngredient({ _id: 'a', name: 'A', type: 'main', price: 1 }),
      addIngredient({ _id: 'b', name: 'B', type: 'main', price: 2 }),
      addIngredient({ _id: 'c', name: 'C', type: 'main', price: 3 }),
    ].reduce((s, a) => reducer(s, a), base);

    jest.clearAllMocks();

    const next = reducer(filled, reorderIngredients({ fromIndex: 0, toIndex: 2 }));

    expect(next.bun).toBeNull();
    expect(next.ingredients.map((i) => i._id)).toEqual(['b', 'c', 'a']);
    expect(next.ingredients.map((i) => i.uuid)).toEqual(['u2', 'u3', 'u1']);
    expect(Object.keys(next).sort()).toEqual(shape);

    expect(saveToSession).toHaveBeenCalledTimes(1);
    const calls = saveToSession.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(SELECTED_INGREDIENTS_KEY);
    expect(calls[0][1]).not.toBeNull();
    expect(typeof calls[0][1]).toBe('object');
  });
});

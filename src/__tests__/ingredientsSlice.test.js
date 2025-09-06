import { ingredientsSlice, fetchIngredients } from '@/services/slices/ingredientsSlice';
import { configureStore } from '@reduxjs/toolkit';

import { expectUnchangedExcept } from '@utils/expectUnchangedExcept.ts';

jest.mock('@utils/api', () => ({
  API: {
    getIngredients: jest.fn(),
  },
}));

import { API } from '@utils/api';

describe('ingredientsSlice', () => {
  const reducer = ingredientsSlice.reducer;
  const getInitialState = () => reducer(undefined, { type: '@@INIT' });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('начальное состояние корректно', () => {
    const state = getInitialState();
    expect(state).toEqual({
      ingredients: [],
      loading: false,
      error: null,
    });
  });

  test('pending: loading=true; error сброшен; остальные поля не изменяются', () => {
    const prev = getInitialState();
    const next = reducer(prev, { type: fetchIngredients.pending.type });
    expectUnchangedExcept(prev, next, { loading: true, error: null });
  });

  test('fulfilled: loading=false; ingredients обновлён; error не изменяется', () => {
    const prev = reducer(getInitialState(), { type: fetchIngredients.pending.type });
    const payload = [
      { _id: '1', name: 'Булка', type: 'bun', price: 10, image: '', image_mobile: '' },
      { _id: '2', name: 'Соус', type: 'sauce', price: 5, image: '', image_mobile: '' },
    ];
    const next = reducer(prev, { type: fetchIngredients.fulfilled.type, payload });
    expectUnchangedExcept(prev, next, { loading: false, ingredients: payload });
  });

  test('rejected: loading=false; error записан; ingredients не изменяется', () => {
    const prev = reducer(getInitialState(), { type: fetchIngredients.pending.type });
    const errorMessage = 'Network error';
    const next = reducer(prev, {
      type: fetchIngredients.rejected.type,
      payload: errorMessage,
    });
    expectUnchangedExcept(prev, next, { loading: false, error: errorMessage });
  });

  test('интеграция thunk (успех)', async () => {
    const mockData = [
      { _id: '1', name: 'Булка', type: 'bun', price: 10, image: '', image_mobile: '' },
    ];
    API.getIngredients.mockResolvedValueOnce({ data: mockData });
    const store = configureStore({ reducer: { ingredients: reducer } });

    expect(store.getState().ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null,
    });

    const pending = store.dispatch(fetchIngredients());
    const during = store.getState().ingredients;
    expectUnchangedExcept(getInitialState(), during, { loading: true, error: null });

    await pending;
    const final = store.getState().ingredients;
    expect(API.getIngredients).toHaveBeenCalledTimes(1);
    expectUnchangedExcept(during, final, { loading: false, ingredients: mockData });
  });

  test('интеграция thunk (ошибка)', async () => {
    const errorMessage = 'Request failed';
    API.getIngredients.mockRejectedValueOnce(new Error(errorMessage));
    const store = configureStore({ reducer: { ingredients: reducer } });

    await store.dispatch(fetchIngredients());
    const state = store.getState().ingredients;
    expect(API.getIngredients).toHaveBeenCalledTimes(1);
    expectUnchangedExcept(getInitialState(), state, {
      loading: false,
      error: errorMessage,
    });
  });
});

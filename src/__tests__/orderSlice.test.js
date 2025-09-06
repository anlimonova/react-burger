import {
  orderSlice,
  initialState,
  fetchOrderAccepting,
  fetchOrderByNumber,
} from '@/services/slices/orderSlice';
import { configureStore } from '@reduxjs/toolkit';

import { expectUnchangedExcept } from '@utils/expectUnchangedExcept.ts';

jest.mock('@utils/api', () => ({
  API: {
    orderAccepting: jest.fn(),
    getOrderByNumber: jest.fn(),
  },
}));

import { API } from '@utils/api';

describe('orderSlice', () => {
  const reducer = orderSlice.reducer;
  const getInitialState = () => reducer(undefined, { type: '@@INIT' });
  const shape = ['error', 'loading', 'orderAccepting', 'orderByNumber'].sort();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('начальное состояние корректно и содержит все поля', () => {
    const state = getInitialState();
    expect(state).toEqual(initialState);
    expect(Object.keys(state).sort()).toEqual(shape);
  });

  test('fetchOrderAccepting.pending: меняются только loading и error', () => {
    const prev = getInitialState();
    const next = reducer(prev, { type: fetchOrderAccepting.pending.type });
    expectUnchangedExcept(prev, next, { loading: true, error: null });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('fetchOrderAccepting.fulfilled: устанавливается orderAccepting, остальные поля корректны', () => {
    const prev = reducer(getInitialState(), { type: fetchOrderAccepting.pending.type });
    const payload = {
      _id: 'x',
      name: 'Order Name',
      number: 101,
      status: 'created',
      ingredients: ['i1', 'i2'],
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    const next = reducer(prev, { type: fetchOrderAccepting.fulfilled.type, payload });
    expectUnchangedExcept(prev, next, { loading: false, orderAccepting: payload });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('fetchOrderAccepting.rejected: устанавливается error, остальные поля корректны', () => {
    const prev = reducer(getInitialState(), { type: fetchOrderAccepting.pending.type });
    const errorMessage = 'Accept error';
    const next = reducer(prev, {
      type: fetchOrderAccepting.rejected.type,
      payload: errorMessage,
    });
    expectUnchangedExcept(prev, next, { loading: false, error: errorMessage });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('fetchOrderByNumber.pending: меняются только loading и error', () => {
    const prev = getInitialState();
    const next = reducer(prev, { type: fetchOrderByNumber.pending.type });
    expectUnchangedExcept(prev, next, { loading: true, error: null });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('fetchOrderByNumber.fulfilled: устанавливается orderByNumber объект', () => {
    const prev = reducer(getInitialState(), { type: fetchOrderByNumber.pending.type });
    const payload = {
      _id: 'o1',
      name: 'By Number',
      number: 777,
      status: 'done',
      ingredients: ['a', 'b'],
      createdAt: '2024-02-02T00:00:00.000Z',
    };
    const next = reducer(prev, { type: fetchOrderByNumber.fulfilled.type, payload });
    expectUnchangedExcept(prev, next, { loading: false, orderByNumber: payload });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('fetchOrderByNumber.fulfilled: null приводит к orderByNumber === null', () => {
    const prev = reducer(getInitialState(), { type: fetchOrderByNumber.pending.type });
    const next = reducer(prev, {
      type: fetchOrderByNumber.fulfilled.type,
      payload: null,
    });
    expectUnchangedExcept(prev, next, { loading: false, orderByNumber: null });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('fetchOrderByNumber.rejected: устанавливается error, остальные поля корректны', () => {
    const prev = reducer(getInitialState(), { type: fetchOrderByNumber.pending.type });
    const errorMessage = 'By number error';
    const next = reducer(prev, {
      type: fetchOrderByNumber.rejected.type,
      payload: errorMessage,
    });
    expectUnchangedExcept(prev, next, { loading: false, error: errorMessage });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('интеграция: fetchOrderAccepting успех', async () => {
    API.orderAccepting.mockResolvedValueOnce({
      name: 'Created',
      order: { number: 900 },
    });
    const store = configureStore({ reducer: { order: reducer } });

    expect(store.getState().order).toEqual(initialState);

    const run = store.dispatch(
      fetchOrderAccepting({ ingredientIds: ['x'], accessToken: 'token' })
    );
    const during = store.getState().order;
    expectUnchangedExcept(initialState, during, { loading: true, error: null });

    await run;

    const final = store.getState().order;
    expect(API.orderAccepting).toHaveBeenCalledTimes(1);
    expect(final.loading).toBe(false);
    expect(final.error).toBeNull();
    expect(final.orderAccepting).toEqual(
      expect.objectContaining({
        name: 'Created',
        number: 900,
        status: 'created',
        ingredients: ['x'],
      })
    );
    expect(typeof final.orderAccepting.createdAt).toBe('string');
    expect(final.orderByNumber).toBeNull();
  });

  test('интеграция: fetchOrderAccepting ошибка', async () => {
    API.orderAccepting.mockRejectedValueOnce(new Error('fail'));
    const store = configureStore({ reducer: { order: reducer } });

    await store.dispatch(
      fetchOrderAccepting({ ingredientIds: ['x'], accessToken: 'token' })
    );

    const s = store.getState().order;
    expect(API.orderAccepting).toHaveBeenCalledTimes(1);
    expectUnchangedExcept(initialState, s, { loading: false, error: 'fail' });
    expect(s.orderAccepting).toBeNull();
    expect(s.orderByNumber).toBeNull();
  });

  test('интеграция: fetchOrderByNumber успех с объектом', async () => {
    const response = {
      _id: 'id1',
      name: 'N',
      number: 321,
      status: 'done',
      ingredients: ['i'],
      createdAt: '2024-03-03T00:00:00.000Z',
    };
    API.getOrderByNumber.mockResolvedValueOnce(response);

    const store = configureStore({ reducer: { order: reducer } });

    const run = store.dispatch(fetchOrderByNumber({ orderNumber: 321 }));
    const during = store.getState().order;
    expectUnchangedExcept(initialState, during, { loading: true, error: null });

    await run;

    const s = store.getState().order;
    expect(API.getOrderByNumber).toHaveBeenCalledWith(321);
    expectUnchangedExcept(during, s, { loading: false, orderByNumber: response });
    expect(s.orderAccepting).toBeNull();
  });

  test('интеграция: fetchOrderByNumber успех с null', async () => {
    API.getOrderByNumber.mockResolvedValueOnce(null);
    const store = configureStore({ reducer: { order: reducer } });
    await store.dispatch(fetchOrderByNumber({ orderNumber: 111 }));
    const s = store.getState().order;
    expect(API.getOrderByNumber).toHaveBeenCalledWith(111);
    expectUnchangedExcept(initialState, s, { loading: false, orderByNumber: null });
    expect(s.orderAccepting).toBeNull();
  });

  test('интеграция: fetchOrderByNumber ошибка', async () => {
    API.getOrderByNumber.mockRejectedValueOnce(new Error('not found'));
    const store = configureStore({ reducer: { order: reducer } });
    await store.dispatch(fetchOrderByNumber({ orderNumber: 404 }));
    const s = store.getState().order;
    expect(API.getOrderByNumber).toHaveBeenCalledWith(404);
    expectUnchangedExcept(initialState, s, { loading: false, error: 'not found' });
    expect(s.orderByNumber).toBeNull();
    expect(s.orderAccepting).toBeNull();
  });
});

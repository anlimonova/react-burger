import {
  profileOrdersSlice,
  initialState,
  onConnectingProfileOrders,
  onOpenProfileOrders,
  onCloseProfileOrders,
  onErrorProfileOrders,
  onMessageProfileOrders,
} from '@/services/slices/profileOrdersSlice';

import { expectUnchangedExcept } from '@utils/expectUnchangedExcept.ts';

jest.mock('@utils/isValidOrder.ts', () => ({
  isValidOrder: jest.fn((o) => o && o.valid !== false),
}));

describe('profileOrdersSlice', () => {
  const reducer = profileOrdersSlice.reducer;
  const getInitialState = () => reducer(undefined, { type: '@@INIT' });
  const shape = ['error', 'orders', 'status', 'total', 'totalToday'].sort();

  test('начальное состояние корректно и содержит все поля', () => {
    const state = getInitialState();
    expect(state).toEqual(initialState);
    expect(Object.keys(state).sort()).toEqual(shape);
  });

  test('onConnectingProfileOrders: меняется только status', () => {
    const prev = getInitialState();
    const next = reducer(prev, onConnectingProfileOrders());
    expectUnchangedExcept(prev, next, { status: 'connecting' });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('onOpenProfileOrders: меняется только status', () => {
    const prev = getInitialState();
    const next = reducer(prev, onOpenProfileOrders());
    expectUnchangedExcept(prev, next, { status: 'online' });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('onCloseProfileOrders: меняется только status', () => {
    const prev = reducer(getInitialState(), onOpenProfileOrders());
    const next = reducer(prev, onCloseProfileOrders());
    expectUnchangedExcept(prev, next, { status: 'offline' });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('onErrorProfileOrders: меняется только error', () => {
    const prev = getInitialState();
    const msg = 'ws error';
    const next = reducer(prev, onErrorProfileOrders(msg));
    expectUnchangedExcept(prev, next, { error: msg });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('onMessageProfileOrders: фильтрация orders и установка total/totalToday; status и error не меняются', () => {
    const prev = getInitialState();
    const payload = {
      orders: [
        { _id: '1', number: 1, status: 'done', valid: true },
        { _id: '2', number: 2, status: 'pending', valid: false },
        { _id: '3', number: 3, status: 'done' },
      ],
      total: 42,
      totalToday: 7,
    };
    const next = reducer(prev, onMessageProfileOrders(payload));
    expectUnchangedExcept(prev, next, {
      orders: payload.orders.filter((o) => o.valid !== false),
      total: 42,
      totalToday: 7,
    });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('onMessageProfileOrders: orders не массив -> []; total/totalToday по умолчанию 0; status/error не меняются', () => {
    const prev = getInitialState();

    const s1 = reducer(prev, onMessageProfileOrders({ orders: null }));
    expectUnchangedExcept(prev, s1, { orders: [], total: 0, totalToday: 0 });
    expect(Object.keys(s1).sort()).toEqual(shape);

    const s2 = reducer(prev, onMessageProfileOrders({ orders: [] }));
    expectUnchangedExcept(prev, s2, { orders: [], total: 0, totalToday: 0 });
    expect(Object.keys(s2).sort()).toEqual(shape);
  });
});

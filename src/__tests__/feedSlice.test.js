import {
  feedSlice,
  initialState,
  onCloseFeed,
  onConnectingFeed,
  onErrorFeed,
  onMessageFeed,
  onOpenFeed,
} from '../services/slices/feedSlice';
import { expectUnchangedExcept } from '@utils/expectUnchangedExcept.ts';

jest.mock('@utils/isValidOrder.ts', () => ({
  isValidOrder: jest.fn((order) => order && order.valid !== false),
}));

describe('feedSlice reducer', () => {
  const reducer = feedSlice.reducer;
  const getInitialState = () => reducer(undefined, { type: '@@INIT' });

  test('возвращает корректное начальное состояние', () => {
    expect(getInitialState()).toEqual(initialState);
  });

  test('onConnectingFeed', () => {
    const prev = getInitialState();
    const next = reducer(prev, onConnectingFeed());
    expectUnchangedExcept(prev, next, { status: 'connecting' });
  });

  test('onOpenFeed', () => {
    const prev = getInitialState();
    const next = reducer(prev, onOpenFeed());
    expectUnchangedExcept(prev, next, { status: 'online' });
  });

  test('onCloseFeed', () => {
    const prev = reducer(getInitialState(), onOpenFeed());
    const next = reducer(prev, onCloseFeed());
    expectUnchangedExcept(prev, next, { status: 'offline' });
  });

  test('onErrorFeed', () => {
    const prev = getInitialState();
    const errorMessage = 'WebSocket error';
    const next = reducer(prev, onErrorFeed(errorMessage));
    expectUnchangedExcept(prev, next, { error: errorMessage });
  });

  test('onMessageFeed: фильтрация и total', () => {
    const prev = getInitialState();
    const payload = {
      orders: [
        { _id: '1', number: 1, status: 'done', valid: true },
        { _id: '2', number: 2, status: 'pending', valid: false },
        { _id: '3', number: 3, status: 'done' },
      ],
      total: 100,
      totalToday: 10,
    };
    const next = reducer(prev, onMessageFeed(payload));

    expect(next.orders.map((o) => o._id)).toEqual(['1', '3']);
    expectUnchangedExcept(prev, next, {
      orders: next.orders,
      total: 100,
      totalToday: 10,
    });
  });

  test('onMessageFeed: некорректный orders', () => {
    const prev = getInitialState();

    const s1 = reducer(prev, onMessageFeed({ orders: null }));
    expectUnchangedExcept(prev, s1, { orders: [], total: 0, totalToday: 0 });

    const s2 = reducer(prev, onMessageFeed({ orders: [] }));
    expectUnchangedExcept(prev, s2, { orders: [], total: 0, totalToday: 0 });
  });
});

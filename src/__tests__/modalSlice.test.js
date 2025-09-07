import { modalSlice, initialState } from '@/services/slices/modalSlice';

import { expectUnchangedExcept } from '@utils/expectUnchangedExcept.ts';

const { openModal, closeModal } = modalSlice.actions;

describe('modalSlice', () => {
  const reducer = modalSlice.reducer;
  const getInitialState = () => reducer(undefined, { type: '@@INIT' });
  const shape = ['modalData', 'modalType'].sort();

  test('начальное состояние корректно, содержит только ожидаемые поля', () => {
    const state = getInitialState();
    expect(state).toEqual(initialState);
    expect(Object.keys(state).sort()).toEqual(shape);
  });

  test('openModal заполняет modalType и modalData, состав полей не меняется', () => {
    const prev = getInitialState();
    const payload = { modalType: 'ORDER', modalData: { id: '123', foo: 'bar' } };
    const next = reducer(prev, openModal(payload));

    expectUnchangedExcept(prev, next, {
      modalType: payload.modalType,
      modalData: payload.modalData,
    });
    expect(Object.keys(next).sort()).toEqual(shape);
  });

  test('closeModal сбрасывает modalType и modalData в null, состав полей не меняется', () => {
    const opened = reducer(
      getInitialState(),
      openModal({ modalType: 'ORDER', modalData: { id: '1' } })
    );
    const next = reducer(opened, closeModal());

    expectUnchangedExcept(opened, next, { modalType: null, modalData: null });
    expect(Object.keys(next).sort()).toEqual(shape);
  });
});

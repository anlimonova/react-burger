import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

type ModalData = Record<string, unknown> | null;
type modalType = string | null;

type ModalState = {
  modalType: modalType;
  modalData: ModalData;
};

const initialState: ModalState = {
  modalType: null,
  modalData: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ modalType: modalType; modalData: ModalData }>
    ) => {
      state.modalType = action.payload.modalType;
      state.modalData = action.payload.modalData;
    },
    closeModal: (state) => {
      state.modalType = null;
      state.modalData = null;
    },
  },
});

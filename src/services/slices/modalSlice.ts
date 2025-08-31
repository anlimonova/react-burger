import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TModalData, TModalType } from '@utils/types';

type ModalState = {
  modalType: TModalType;
  modalData: TModalData;
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
      action: PayloadAction<{ modalType: TModalType; modalData: TModalData }>
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

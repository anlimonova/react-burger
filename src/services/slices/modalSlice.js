import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
	name: 'modal',
	initialState: {
		modalType: null,
		modalData: null,
	},
	reducers: {
		openModal: (state, action) => {
			state.modalType = action.payload.modalType;
			state.modalData = action.payload.modalData;
		},
		closeModal: (state) => {
			state.modalType = null;
			state.modalData = null;
		},
	},
});

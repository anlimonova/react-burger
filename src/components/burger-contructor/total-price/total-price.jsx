import React from 'react';
import styles from './total-price.module.css';
import * as PropTypes from 'prop-types';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Price } from '@components/ui/price/price.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { modalSlice } from '@/services/slices/modalSlice.js';
import { Modal } from '@components/modals/modal/modal.jsx';
import { OrderDetails } from '@components/modals/order-details/order-details.jsx';
import { fetchOrderDetails } from '@/services/slices/orderSlice.js';
import { selectedIngredientsSlice } from '@/services/slices/selectedIngredientsSlice.js';
import { Preloader } from '@components/preloader/preloader.jsx';

export const TotalPrice = ({ price }) => {
	const dispatch = useDispatch();
	const { modalType, modalData } = useSelector((state) => state.modal);
	const { bun, ingredients } = useSelector(
		(state) => state.selectedIngredients
	);

	const { loading } = useSelector((state) => state.order);

	const handleClick = async () => {
		const ingredientIds = ingredients.map((item) => item._id);
		if (bun) {
			ingredientIds.unshift(bun._id);
			ingredientIds.push(bun._id);
		}
		const resultAction = await dispatch(fetchOrderDetails(ingredientIds));

		if (fetchOrderDetails.fulfilled.match(resultAction)) {
			dispatch(
				modalSlice.actions.openModal({
					modalType: 'order',
					modalData: { id: resultAction.payload?.order?.number },
				})
			);

			dispatch(selectedIngredientsSlice.actions.resetSelectedIngredients());
		}
	};

	return (
		<section className={styles['total-price'] + ' pr-4'}>
			<Price price={price} isLarge />
			<Button
				htmlType='button'
				type='primary'
				size='large'
				onClick={handleClick}
				disabled={!bun || ingredients.length === 0}>
				Оформить заказ
			</Button>
			{modalType === 'order' && (
				<Modal onClose={() => dispatch(modalSlice.actions.closeModal())}>
					<OrderDetails idNumber={modalData?.id} />
				</Modal>
			)}
			{loading && <Preloader />}
		</section>
	);
};

TotalPrice.propTypes = {
	price: PropTypes.number.isRequired,
};

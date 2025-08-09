import React, { useMemo } from 'react';
import styles from './total-price.module.css';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Price } from '@components/ui/price/price.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { modalSlice } from '@/services/slices/modalSlice.js';
import { Modal } from '@components/modals/modal/modal.jsx';
import { OrderDetails } from '@components/modals/order-details/order-details.jsx';
import { fetchOrderDetails } from '@/services/slices/orderSlice.js';
import { selectedIngredientsSlice } from '@/services/slices/selectedIngredientsSlice.js';
import { useNavigate } from 'react-router-dom';
import { PageOverlay } from '@components/page-overlay/page-overlay.jsx';

export const TotalPrice = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.user);
	const { modalType, modalData } = useSelector((state) => state.modal);
	const { bun, ingredients } = useSelector(
		(state) => state.selectedIngredients
	);
	const { loading } = useSelector((state) => state.order);

	const totalPriceValue = useMemo(() => {
		const bunPrice = bun ? bun.price * 2 : 0;
		const ingredientsPrice = ingredients.reduce(
			(sum, item) => sum + item.price,
			0
		);
		return bunPrice + ingredientsPrice;
	}, [bun, ingredients]);

	const handleClick = async () => {
		if (!user) {
			navigate('/login');
			return;
		}

		const accessToken = localStorage.getItem('accessToken');
		if (!accessToken) {
			navigate('/login');
			return;
		}

		const ingredientIds = ingredients.map((item) => item._id);
		if (bun) {
			ingredientIds.unshift(bun._id);
			ingredientIds.push(bun._id);
		}
		const resultAction = await dispatch(
			fetchOrderDetails({ ingredientIds, accessToken })
		);

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
			<Price price={totalPriceValue} isLarge />
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
			{loading && <PageOverlay />}
		</section>
	);
};

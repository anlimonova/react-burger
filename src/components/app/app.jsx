import React, { useEffect } from 'react';
import styles from './app.module.css';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { Preloader } from '@components/preloader/preloader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '@/services/slices/ingredientsSlice.js';
import { modalSlice } from '@/services/slices/modalSlice.js';
import { Modal } from '@components/modals/modal/modal.jsx';
import { IngredientDetails } from '@components/modals/ingredient-details/ingredient-details.jsx';
import { Home } from '@pages/home/home.jsx';
import { Login } from '@pages/login/login.jsx';
import { Profile } from '@pages/profile/profile.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Routes, Route } from 'react-router-dom';
import { Registration } from '@pages/registration/registration.jsx';
import { PasswordRecovery } from '@pages/password-recovery/password-recovery.jsx';

export const App = () => {
	const dispatch = useDispatch();
	const { ingredients, loading } = useSelector((state) => state.ingredients);
	const { modalType, modalData } = useSelector((state) => state.modal);

	useEffect(() => {
		const promise = dispatch(fetchIngredients());
		return () => {
			promise.abort();
		};
	}, [dispatch]);

	if (loading || ingredients.length === 0) {
		return (
			<div className={styles.app}>
				<Preloader />;
			</div>
		);
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<div className={styles.app}>
				<AppHeader />
				<main className={`${styles.main} pl-5 pr-5`}>
					<Routes>
						<Route path='/home' element={<Home />}></Route>
						<Route path='/login' element={<Login />}></Route>
						<Route path='/registration' element={<Registration />}></Route>
						<Route
							path='/password-recovery'
							element={<PasswordRecovery />}></Route>
						<Route path='/profile' element={<Profile />}></Route>
					</Routes>
				</main>
				{modalType === 'ingredient' && (
					<Modal
						title={'Детали ингредиента'}
						onClose={() => dispatch(modalSlice.actions.closeModal())}>
						<IngredientDetails ingredient={modalData} />
					</Modal>
				)}
			</div>
		</DndProvider>
	);
};

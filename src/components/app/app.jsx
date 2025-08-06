import React, { useEffect } from 'react';
import styles from './app.module.css';
import { AppHeader } from '@components/app-header/app-header.jsx';
import { Home } from '@pages/home/home.jsx';
import { Login } from '@pages/login/login.jsx';
import { Profile } from '@pages/profile/profile.jsx';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Registration } from '@pages/registration/registration.jsx';
import { ForgotPassword } from '@pages/forgot-password/forgot-password.jsx';
import { ResetPassword } from '@pages/reset-password/reset-password.jsx';
import { modalSlice } from '@/services/slices/modalSlice.js';
import { IngredientDetails } from '@components/modals/ingredient-details/ingredient-details.jsx';
import { Modal } from '@components/modals/modal/modal.jsx';
import { useDispatch } from 'react-redux';
import {
	OnlyAuth,
	OnlyUnAuth,
} from '@components/protected-route/protected-route.jsx';
import { checkAuth } from '@/services/slices/userSlice';

export const App = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const background = location.state && location.state.background;
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(checkAuth());
	}, [dispatch]);

	const handleModalClose = () => {
		dispatch(modalSlice.actions.closeModal());
		navigate(-1);
	};

	return (
		<div className={styles.app}>
			<AppHeader />
			<main className={`${styles.main} pl-5 pr-5`}>
				<Routes location={background || location}>
					<Route path='/' element={<Home />}></Route>
					<Route
						path='/ingredients/:ingredientId'
						element={<IngredientDetails />}
					/>
					<Route
						path='/login'
						element={<OnlyUnAuth component={<Login />} />}></Route>
					<Route
						path='/registration'
						element={<OnlyUnAuth component={<Registration />} />}></Route>
					<Route
						path='/forgot-password'
						element={<OnlyUnAuth component={<ForgotPassword />} />}></Route>
					<Route
						path='/reset-password'
						element={<OnlyUnAuth component={<ResetPassword />} />}></Route>
					<Route
						path='/profile'
						element={<OnlyAuth component={<Profile />} />}></Route>
					{/*<Route path='*' element={<NotFound404 />} />*/}
				</Routes>

				{background && (
					<Routes>
						<Route
							path='/ingredients/:ingredientId'
							element={
								<Modal title='Детали ингредиента' onClose={handleModalClose}>
									<IngredientDetails modal />
								</Modal>
							}
						/>
					</Routes>
				)}
			</main>
		</div>
	);
};

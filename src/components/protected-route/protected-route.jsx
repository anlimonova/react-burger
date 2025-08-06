import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ onlyUnAuth = false, component }) => {
	const location = useLocation();
	const { user, isAuthChecked } = useSelector((store) => store.user);

	if (!isAuthChecked) {
		return <div>Загрузка...</div>;
	}

	if (!onlyUnAuth && !user) {
		// Пользователь не авторизован, но маршрут для авторизованных
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	if (onlyUnAuth && user) {
		// Пользователь авторизован, но маршрут только для неавторизованных
		const from = location.state?.from || { pathname: '/' };
		return <Navigate to={from} replace />;
	}

	return component;
};

export const OnlyAuth = ProtectedRoute;
export const OnlyUnAuth = ({ component }) => (
	<ProtectedRoute onlyUnAuth={true} component={component} />
);

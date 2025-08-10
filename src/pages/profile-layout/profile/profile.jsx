import React, { useEffect, useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, setUser } from '@/services/slices/userSlice.js';
import { API } from '@utils/api.js';

export const Profile = () => {
	const { user } = useSelector((store) => store.user);
	const dispatch = useDispatch();
	const accessToken = localStorage.getItem('accessToken');

	const [name, setName] = useState('');
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		const promise = dispatch(checkAuth());
		return () => {
			promise.abort();
		};
	}, [dispatch]);

	useEffect(() => {
		if (user) {
			setName(user.name || '');
			setLogin(user.email || '');
		}
	}, [user]);

	const handleSubmit = async (e) => {
		e?.preventDefault();
		try {
			const response = await API.updateUser(name, login, password, accessToken);
			dispatch(setUser(response.user));
		} catch (error) {
			console.error('Ошибка при изменении данных профиля:', error.message);
		}
	};

	const handleReset = () => {
		if (user) {
			setName(user.name);
			setLogin(user.email);
		}
	};

	const inputs = [
		{
			type: 'text',
			placeholder: 'Имя',
			onChange: (e) => setName(e.target.value),
			name: 'name',
			value: name,
			iconName: 'EditIcon',
		},
		{
			type: 'text',
			placeholder: 'Логин',
			onChange: (e) => setLogin(e.target.value),
			name: 'login',
			value: login,
			iconName: 'EditIcon',
		},
		{
			type: 'password',
			placeholder: 'Пароль',
			onChange: (e) => setPassword(e.target.value),
			name: 'password',
			value: password,
			iconName: 'EditIcon',
		},
	];

	return (
		<AuthForm
			mode='inside'
			inputs={inputs}
			mainButtonText='Сохранить'
			handleSubmit={handleSubmit}
			secondaryButtonText='Отмена'
			handleSecondaryButtonClick={handleReset}
		/>
	);
};

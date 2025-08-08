import React, { useEffect, useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';
import { useNavigate } from 'react-router-dom';
import { API } from '@utils/api.js';

export const ResetPassword = () => {
	const [code, setCode] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const isInitiated = localStorage.getItem('isPasswordResetInitiated');
		if (!isInitiated) {
			navigate('/forgot-password');
		}
	}, [navigate]);

	const handleSubmit = async () => {
		try {
			await API.passwordResetConfirm(password, code);
			localStorage.removeItem('isPasswordResetInitiated');
			navigate('/login');
		} catch (error) {
			console.error('Ошибка при сбросе пароля:', error.message);
		}
	};

	const secondInputs = [
		{
			type: 'password',
			placeholder: 'Введите новый пароль',
			onChange: (e) => setPassword(e.target.value),
			name: 'password',
			value: password,
		},
		{
			type: 'text',
			placeholder: 'Введите код из письма',
			onChange: (e) => setCode(e.target.value),
			name: 'code',
			value: code,
		},
	];

	const links = [
		{
			text: 'Вспомнили пароль?',
			label: 'Войти',
			href: '/login',
		},
	];

	return (
		<AuthForm
			title='Восстановление пароля'
			inputs={secondInputs}
			mainButtonText='Сохранить'
			handleButtonClick={handleSubmit}
			buttonType={'button'}
			links={links}
		/>
	);
};

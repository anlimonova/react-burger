import React, { useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';
import { useNavigate } from 'react-router-dom';
import { API } from '@utils/api.js';

export const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async () => {
		try {
			await API.passwordReset(email);
			localStorage.setItem('isPasswordResetInitiated', 'true');
			navigate('/reset-password');
		} catch (error) {
			console.error('Ошибка при отправке email:', error.message);
		}
	};

	const firstInputs = [
		{
			type: 'email',
			placeholder: 'Укажите e-mail',
			onChange: (e) => setEmail(e.target.value),
			name: 'email',
			value: email,
		},
	];

	const links = [
		{
			text: 'Вспомнили пароль?',
			label: 'Войти',
			href: './login',
		},
	];

	return (
		<AuthForm
			title='Восстановление пароля'
			inputs={firstInputs}
			buttonText='Восстановить'
			handleButtonClick={handleSubmit}
			buttonType={'button'}
			links={links}
		/>
	);
};

import React, { useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/services/slices/userSlice';

export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useDispatch();

	const handleClick = () => {
		dispatch(loginUser({ email, password }));
	};

	const inputs = [
		{
			type: 'email',
			placeholder: 'E-mail',
			onChange: (e) => setEmail(e.target.value),
			name: 'email',
			value: email,
		},
		{
			type: 'password',
			placeholder: 'Пароль',
			onChange: (e) => setPassword(e.target.value),
			name: 'password',
			value: password,
		},
	];

	const links = [
		{
			text: 'Вы — новый пользователь?',
			label: 'Зарегистрироваться',
			href: './registration',
		},
		{
			text: 'Забыли пароль?',
			label: 'Восстановить пароль',
			href: './forgot-password',
		},
	];

	return (
		<AuthForm
			title='Вход'
			inputs={inputs}
			buttonText='Войти'
			handleButtonClick={handleClick}
			links={links}
		/>
	);
};

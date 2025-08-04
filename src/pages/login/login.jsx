import React, { useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';

export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

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
			href: './password-recovery',
		},
	];

	return (
		<AuthForm title='Вход' inputs={inputs} buttonText='Войти' links={links} />
	);
};

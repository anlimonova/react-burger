import React, { useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';

export const Registration = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const inputs = [
		{
			type: 'text',
			placeholder: 'Имя',
			onChange: (e) => setName(e.target.value),
			name: 'name',
			value: name,
		},
		{
			type: 'text',
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
			text: 'Уже зарегистрированы?',
			label: 'Войти',
			href: './login',
		},
	];

	return (
		<AuthForm
			title='Регистрация'
			inputs={inputs}
			buttonText='Зарегистрироваться'
			links={links}
		/>
	);
};

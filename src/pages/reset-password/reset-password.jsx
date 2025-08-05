import React, { useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';

export const ResetPassword = () => {
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [password, setPassword] = useState('');
	const [userExist, setUserExist] = useState(false);

	const firstInputs = [
		{
			type: 'email',
			placeholder: 'Укажите e-mail',
			onChange: (e) => setEmail(e.target.value),
			name: 'email',
			value: email,
		},
	];

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
			href: './login',
		},
	];

	return userExist ? (
		<AuthForm
			title='Восстановление пароля'
			inputs={secondInputs}
			buttonText='Сохранить'
			handleButtonClick={() => {
				setUserExist(false);
			}}
			buttonType={'button'}
			links={links}
		/>
	) : (
		<AuthForm
			title='Восстановление пароля'
			inputs={firstInputs}
			buttonText='Восстановить'
			handleButtonClick={() => {
				setUserExist(true);
			}}
			buttonType={'button'}
			links={links}
		/>
	);
};

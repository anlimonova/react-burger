import React, { useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';

export const PasswordRecovery = () => {
	const [email, setEmail] = useState('');

	const inputs = [
		{
			type: 'text',
			placeholder: 'Укажите e-mail',
			onChange: (e) => setEmail(e.target.value),
			name: 'email',
			value: email,
		}
	];

	const links = [
		{
			text: 'Вспомнили пароль?',
			label: 'Войти',
			href: './login',
		},
	];

	return (
		<AuthForm title='Восстановление пароля' inputs={inputs} buttonText='Восстановить' links={links} />
	);
};

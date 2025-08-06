import React, { useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';
import { useSelector } from 'react-redux';

export const Profile = () => {
	const { user } = useSelector((store) => store.user);
	const [name, setName] = useState(user.name);
	const [login, setLogin] = useState(user.email);
	const [password, setPassword] = useState('');

	const inputs = [
		{
			type: 'text',
			placeholder: 'Имя',
			onChange: (e) => setName(e.target.value),
			name: 'name',
			value: name,
			iconName: 'EditIcon',
			readOnly: true,
		},
		{
			type: 'text',
			placeholder: 'Логин',
			onChange: (e) => setLogin(e.target.value),
			name: 'login',
			value: login,
			iconName: 'EditIcon',
			readOnly: true,
		},
		{
			type: 'password',
			placeholder: 'Пароль',
			onChange: (e) => setPassword(e.target.value),
			name: 'password',
			value: password,
			iconName: 'EditIcon',
			readOnly: true,
		},
	];

	return <AuthForm mode='inside' inputs={inputs} />;
};

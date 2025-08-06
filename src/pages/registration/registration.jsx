import React, { useEffect, useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, getUser } from '@/services/slices/userSlice.js';
import { useNavigate } from 'react-router-dom';

export const Registration = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const user = useSelector(getUser);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleClick = () => {
		dispatch(registerUser({ name, email, password }));
	};

	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user, navigate]);

	const inputs = [
		{
			type: 'text',
			placeholder: 'Имя',
			onChange: (e) => setName(e.target.value),
			name: 'name',
			value: name,
		},
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
			handleButtonClick={handleClick}
			links={links}
		/>
	);
};

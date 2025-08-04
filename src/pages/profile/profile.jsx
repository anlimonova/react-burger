import React, { useState } from 'react';
import { AuthForm } from '@components/auth-form/auth-form.jsx';
import styles from './profile.module.css';

export const Profile = () => {
	const [name, setName] = useState('Марк');
	const [login, setLogin] = useState('mail@stellar.burgers');
	const [password, setPassword] = useState('1234');

	const inputs = [
		{
			type: 'text',
			placeholder: 'Имя',
			onChange: (e) => setName(e.target.value),
			name: 'name',
			value: name,
			iconName: 'EditIcon',
			// readOnly: true,
		},
		{
			type: 'text',
			placeholder: 'Логин',
			onChange: (e) => setLogin(e.target.value),
			name: 'login',
			value: login,
			iconName: 'EditIcon',
			// readOnly: true,
		},
		{
			type: 'password',
			placeholder: 'Пароль',
			onChange: (e) => setPassword(e.target.value),
			name: 'password',
			value: password,
			iconName: 'EditIcon',
			// readOnly: true,
		},
	];

	return (
		<section className={styles.profile + ' mt-30'}>
			<nav className={styles.navigation + ' text text_type_main-medium mr-15'}>
				<ul>
					<li>
						<a href='#' className={`${styles.link_active}`}>
							Профиль
						</a>
					</li>
					<li>
						<a href='#'>
							История заказов
						</a>
					</li>
					<li>
						<a href='#'>
							Выход
						</a>
					</li>
				</ul>
				<span className={styles.note + ' text text_type_main-default mt-20'}>
					В этом разделе вы можете изменить свои персональные данные
				</span>
			</nav>
			<AuthForm mode='inside' inputs={inputs} />
		</section>
	);
};

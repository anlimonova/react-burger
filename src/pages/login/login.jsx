import React, { useState } from 'react';
import styles from './login.module.css';
import {
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';

export const Login = () => {
	const [value, setValue] = useState('');
	const [iconName, setIconName] = useState('ShowIcon');
	const [passwordInputType, setPasswordInputType] = useState('password');

	const onIconClick = () => {
		iconName === 'HideIcon' ? setIconName('ShowIcon') : setIconName('HideIcon');
		passwordInputType === 'password' ? setPasswordInputType('text') : setPasswordInputType('password');
	};


	return (
		<section className={`${styles.centered}`}>
			<h1 className={'text text_type_main-medium mb-6'}>
				Вход
			</h1>
			<form className={`${styles.form}`}>
				<Input
					type={'text'}
					placeholder={'E-mail'}
					onChange={(e) => setValue(e.target.value)}
					name={'e-mail'}
					value={value}
					error={false}
					size={'default'}
				/>
				<Input
					type={passwordInputType}
					placeholder={'Пароль'}
					onChange={(e) => setValue(e.target.value)}
					icon={iconName}
					onIconClick={onIconClick}
					name={'password'}
					value={value}
					error={false}
					size={'default'}
				/>
				<Button htmlType='submit' type='primary' size='medium'>
					Войти
				</Button>
			</form>
			<div className={`${styles.links} mt-20`}>
				<span className={'text text_type_main-default'}>
					Вы — новый пользователь?{' '}
					<a href={'./registration'}>Зарегистрироваться</a>
				</span>
				<span className={'text text_type_main-default mt-1'}>
					Забыли пароль? <a href={'./password-recovery'}>Восстановить пароль</a>
				</span>
			</div>
		</section>
	);
};

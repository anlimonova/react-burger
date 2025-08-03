import React from 'react';
import styles from './auth-form.module.css';
import {
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useTogglePassword } from '@/hooks/useTogglePassword.js';

export const AuthForm = ({ title, inputs, buttonText, links }) => {
	const { iconName, passwordInputType, onIconClick } = useTogglePassword();

	return (
		<section className={`${styles.centered}`}>
			<h1 className={'text text_type_main-medium mb-6'}>{title}</h1>
			<form className={`${styles.form}`}>
				{inputs.map((input) => (
					<Input
						key={input.name}
						type={input.type === 'password' ? passwordInputType : input.type}
						placeholder={input.placeholder}
						onChange={input.onChange}
						icon={input.type === 'password' ? iconName : undefined}
						onIconClick={input.type === 'password' ? onIconClick : undefined}
						name={input.name}
						value={input.value}
						error={false}
						size={'default'}
					/>
				))}
				<Button htmlType='submit' type='primary' size='medium'>
					{buttonText}
				</Button>
			</form>
			<div className={`${styles.links} mt-20`}>
				{links.map((link, index) => (
					<span
						key={index}
						className={
							'text text_type_main-default' + (index > 0 ? ' mt-1' : '')
						}>
						{link.text} <a href={link.href}>{link.label}</a>
					</span>
				))}
			</div>
		</section>
	);
};

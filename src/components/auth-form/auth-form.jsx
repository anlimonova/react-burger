import React from 'react';
import styles from './auth-form.module.css';
import {
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useTogglePassword } from '@/hooks/useTogglePassword.js';
import * as PropTypes from 'prop-types';

export const AuthForm = ({
	mode,
	title,
	inputs,
	buttonText,
	handleButtonClick,
	buttonType,
	links,
}) => {
	const { passwordIconName, passwordInputType, onIconClick } =
		useTogglePassword();

	return (
		<section className={`${styles.centered} ${mode && styles[mode]}`}>
			{title && <h1 className={'text text_type_main-medium mb-6'}>{title}</h1>}
			<form className={`${styles.form}`}>
				{inputs.map((input) => (
					<Input
						key={input.name}
						type={input.type === 'password' ? passwordInputType : input.type}
						placeholder={input.placeholder}
						onChange={input.onChange}
						icon={
							input.iconName
								? input.iconName
								: input.type === 'password'
									? passwordIconName
									: undefined
						}
						onIconClick={input.type === 'password' ? onIconClick : undefined}
						name={input.name}
						value={input.value}
						error={false}
						size={'default'}
					/>
				))}
				{buttonText && (
					<Button
						htmlType={buttonType || 'submit'}
						type='primary'
						size='medium'
						onClick={handleButtonClick}>
						{buttonText}
					</Button>
				)}
			</form>
			{links && (
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
			)}
		</section>
	);
};

AuthForm.propTypes = {
	mode: PropTypes.string,
	title: PropTypes.string,
	inputs: PropTypes.array.isRequired,
	buttonText: PropTypes.string,
	handleButtonClick: PropTypes.func,
	buttonType: PropTypes.string,
	links: PropTypes.array,
};

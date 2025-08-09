import React from 'react';
import {
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useTogglePassword } from '@/hooks/useTogglePassword.js';
import styles from './auth-form.module.css';
import * as PropTypes from 'prop-types';

export const AuthForm = ({
	mode,
	title,
	inputs,
	mainButtonText,
	handleSubmit,
	links,
	secondaryButtonText,
	handleSecondaryButtonClick,
}) => {
	const { passwordIconName, passwordInputType, onIconClick } =
		useTogglePassword();

	return (
		<section className={`${styles.centered} ${mode && styles[mode]}`}>
			{title && <h1 className={'text text_type_main-medium mb-6'}>{title}</h1>}
			<form className={`${styles.form}`} onSubmit={(e) => handleSubmit(e)}>
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
				<div className={secondaryButtonText && `${styles.buttons}`}>
					{secondaryButtonText && (
						<Button
							htmlType='button'
							type='secondary'
							size='medium'
							onClick={handleSecondaryButtonClick}>
							{secondaryButtonText}
						</Button>
					)}
					{mainButtonText && (
						<Button htmlType='submit' type='primary' size='medium'>
							{mainButtonText}
						</Button>
					)}
				</div>
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
	inputs: PropTypes.arrayOf(
		PropTypes.shape({
			type: PropTypes.string.isRequired,
			placeholder: PropTypes.string,
			onChange: PropTypes.func.isRequired,
			name: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
			iconName: PropTypes.string,
		})
	).isRequired,
	mainButtonText: PropTypes.string,
	handleSubmit: PropTypes.func,
	secondaryButtonText: PropTypes.string,
	handleSecondaryButtonClick: PropTypes.func,
	links: PropTypes.arrayOf(
		PropTypes.shape({
			text: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			href: PropTypes.string.isRequired,
		})
	),
};

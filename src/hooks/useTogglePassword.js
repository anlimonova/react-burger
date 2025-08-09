import { useState } from 'react';

export const useTogglePassword = () => {
	const [iconName, setIconName] = useState('ShowIcon');
	const [passwordInputType, setPasswordInputType] = useState('password');

	const onIconClick = () => {
		setIconName(iconName === 'HideIcon' ? 'ShowIcon' : 'HideIcon');
		setPasswordInputType(
			passwordInputType === 'password' ? 'text' : 'password'
		);
	};

	return { iconName, passwordInputType, onIconClick };
};

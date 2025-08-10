import { useState } from 'react';

type IconName = 'ShowIcon' | 'HideIcon';
type InputType = 'password' | 'text';

export const useTogglePassword = (): {
  iconName: IconName;
  passwordInputType: InputType;
  onIconClick: () => void;
} => {
  const [iconName, setIconName] = useState<IconName>('ShowIcon');
  const [passwordInputType, setPasswordInputType] = useState<InputType>('password');

  const onIconClick = (): void => {
    setIconName(iconName === 'HideIcon' ? 'ShowIcon' : 'HideIcon');
    setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password');
  };

  return { iconName, passwordInputType, onIconClick };
};

import { useAuthSubmit } from '@/hooks/useAuthSubmit';
import { useState } from 'react';

import { AuthForm } from '@components/auth-form/auth-form';
import { loginUser } from '@services/slices/userSlice';

import type { TFormInputField, TFormLink } from '@utils/types';
import type { ChangeEvent } from 'react';
import type React from 'react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const action = (): ReturnType<typeof loginUser> => loginUser({ email, password });
  const handleSubmit = useAuthSubmit(action);

  const inputs: TFormInputField[] = [
    {
      type: 'email',
      placeholder: 'E-mail',
      onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      name: 'email',
      value: email,
    },
    {
      type: 'password',
      placeholder: 'Пароль',
      onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      name: 'password',
      value: password,
    },
  ];

  const links: TFormLink[] = [
    {
      text: 'Вы — новый пользователь?',
      label: 'Зарегистрироваться',
      href: '/registration',
    },
    {
      text: 'Забыли пароль?',
      label: 'Восстановить пароль',
      href: '/forgot-password',
    },
  ];

  return (
    <AuthForm
      title="Вход"
      inputs={inputs}
      mainButtonText="Войти"
      handleSubmit={() => handleSubmit}
      links={links}
    />
  );
};

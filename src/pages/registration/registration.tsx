import { useAuthSubmit } from '@/hooks/useAuthSubmit';
import { useState } from 'react';

import { AuthForm } from '@components/auth-form/auth-form';
import { registerUser } from '@services/slices/userSlice';

import type { TFormInputField, TFormLink } from '@utils/types';
import type { ChangeEvent } from 'react';
import type React from 'react';

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

export const Registration: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const action = (): ReturnType<typeof registerUser> =>
    registerUser({ name, email, password });
  const handleSubmit = useAuthSubmit(action);

  const inputs: TFormInputField[] = [
    {
      type: 'text',
      placeholder: 'Имя',
      onChange: (e: InputChangeEvent): void => setName(e.target.value),
      name: 'name',
      value: name,
    },
    {
      type: 'email',
      placeholder: 'E-mail',
      onChange: (e: InputChangeEvent): void => setEmail(e.target.value),
      name: 'email',
      value: email,
    },
    {
      type: 'password',
      placeholder: 'Пароль',
      onChange: (e: InputChangeEvent): void => setPassword(e.target.value),
      name: 'password',
      value: password,
    },
  ];

  const links: TFormLink[] = [
    {
      text: 'Уже зарегистрированы?',
      label: 'Войти',
      href: '/login',
    },
  ];

  return (
    <AuthForm
      title="Регистрация"
      inputs={inputs}
      mainButtonText="Зарегистрироваться"
      handleSubmit={() => handleSubmit}
      links={links}
    />
  );
};

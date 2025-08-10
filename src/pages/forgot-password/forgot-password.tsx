import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthForm } from '@components/auth-form/auth-form';
import { API } from '@utils/api';

import type { TFormInputField, TFormLink } from '@utils/types';
import type { ChangeEvent, FormEvent } from 'react';
import type React from 'react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await API.passwordReset(email);
      localStorage.setItem('isPasswordResetInitiated', 'true');
      void navigate('/reset-password');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Ошибка при отправке email:', error.message);
      } else {
        console.error('Неизвестная ошибка:', error);
      }
    }
  };

  const firstInputs: TFormInputField[] = [
    {
      type: 'email',
      placeholder: 'Укажите e-mail',
      onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      name: 'email',
      value: email,
    },
  ];

  const links: TFormLink[] = [
    {
      text: 'Вспомнили пароль?',
      label: 'Войти',
      href: '/login',
    },
  ];

  return (
    <AuthForm
      title="Восстановление пароля"
      inputs={firstInputs}
      mainButtonText="Восстановить"
      handleSubmit={() => handleSubmit}
      links={links}
    />
  );
};

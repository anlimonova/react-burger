import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthForm } from '@components/auth-form/auth-form';
import { API } from '@utils/api';

import type { ChangeEvent, FormEvent } from 'react';
import type React from 'react';

type TInputField = {
  type: 'text' | 'password' | 'email';
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
};

type TLink = {
  text: string;
  label: string;
  href: string;
};

export const ResetPassword: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const isInitiated = localStorage.getItem('isPasswordResetInitiated');
    if (!isInitiated) {
      void navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await API.passwordResetConfirm(password, code);
      localStorage.removeItem('isPasswordResetInitiated');
      void navigate('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Ошибка при сбросе пароля:', error.message);
      } else {
        console.error('Неизвестная ошибка при сбросе пароля');
      }
    }
  };

  const secondInputs: TInputField[] = [
    {
      type: 'password',
      placeholder: 'Введите новый пароль',
      onChange: (e) => setPassword(e.target.value),
      name: 'password',
      value: password,
    },
    {
      type: 'text',
      placeholder: 'Введите код из письма',
      onChange: (e) => setCode(e.target.value),
      name: 'code',
      value: code,
    },
  ];

  const links: TLink[] = [
    {
      text: 'Вспомнили пароль?',
      label: 'Войти',
      href: '/login',
    },
  ];

  return (
    <AuthForm
      title="Восстановление пароля"
      inputs={secondInputs}
      mainButtonText="Сохранить"
      handleSubmit={() => handleSubmit}
      links={links}
    />
  );
};

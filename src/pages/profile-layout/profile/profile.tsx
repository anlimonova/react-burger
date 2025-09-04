import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useEffect, useState } from 'react';

import { AuthForm } from '@components/auth-form/auth-form';
import { checkAuth, setUser } from '@services/slices/userSlice';
import { API } from '@utils/api';

import type { RootState } from '@services/store';
import type { TFormInputField } from '@utils/types';
import type { ChangeEvent, FormEvent } from 'react';
import type React from 'react';

export const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);

  const accessToken = localStorage.getItem('accessToken') ?? '';

  const [name, setName] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect((): (() => void) => {
    const promise = dispatch(checkAuth());

    return () => {
      promise.abort?.();
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setLogin(user.email ?? '');
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await API.updateUser(name, login, password, accessToken);
      dispatch(setUser(response.user));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Ошибка при изменении данных профиля:', error.message);
      } else {
        console.error('Неизвестная ошибка при изменении данных профиля');
      }
    }
  };

  const handleReset = (): void => {
    if (user) {
      setName(user.name);
      setLogin(user.email);
      setPassword('');
    }
  };

  const inputs: TFormInputField[] = [
    {
      type: 'text',
      placeholder: 'Имя',
      onChange: (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value),
      name: 'name',
      value: name,
      icon: 'EditIcon',
    },
    {
      type: 'text',
      placeholder: 'Логин',
      onChange: (e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value),
      name: 'login',
      value: login,
      icon: 'EditIcon',
    },
    {
      type: 'password',
      placeholder: 'Пароль',
      onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      name: 'password',
      value: password,
      icon: 'EditIcon',
    },
  ];

  return (
    <AuthForm
      mode="inside"
      inputs={inputs}
      mainButtonText="Сохранить"
      handleSubmit={handleSubmit}
      secondaryButtonText="Отмена"
      handleSecondaryButtonClick={handleReset}
    />
  );
};

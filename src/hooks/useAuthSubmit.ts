import { useAppDispatch } from '@/hooks/reduxHooks.ts';
import { useLocation, useNavigate } from 'react-router-dom';

import type { AsyncThunkAction } from '@reduxjs/toolkit';
import type { FormEvent } from 'react';
import type React from 'react';

type LocationState = {
  from?: { pathname: string };
};

/**
 * Выполняет экшен авторизации/регистрации и редиректит обратно на защищённый маршрут
 * @param actionCreator - функция, возвращающая AsyncThunkAction
 * @param onSuccess - колбэк при успешном выполнении
 * @returns handleSubmit - функция для onSubmit формы
 */
export const useAuthSubmit = <Returned, ThunkArg>(
  actionCreator: (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, object>,
  onSuccess?: () => void
): ((e?: FormEvent<HTMLFormElement>, arg?: ThunkArg) => Promise<void>) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const from = state?.from?.pathname ?? '/';

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>,
    arg?: ThunkArg
  ): Promise<void> => {
    e?.preventDefault();
    if (!arg) return;

    try {
      await dispatch(actionCreator(arg)).unwrap();
      onSuccess?.();
      void navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        console.error('Ошибка запроса:', err.message);
      } else {
        console.error('Ошибка запроса:', err);
      }
    }
  };

  return handleSubmit;
};

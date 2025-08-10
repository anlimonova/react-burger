import { useAppDispatch } from '@/hooks/reduxHooks';
import { useLocation, useNavigate } from 'react-router-dom';

import type { AsyncThunkAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '@services/store';
import type { FormEvent } from 'react';

type LocationState = {
  from?: { pathname: string };
};

/**
 * Выполняет экшен авторизации/регистрации и редиректит обратно на защищённый маршрут
 * @param actionCreator - функция, возвращающая AsyncThunkAction
 * @param onSuccess - колбэк при успешном выполнении
 */
export const useAuthSubmit = <Returned, ThunkArg>(
  actionCreator: (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, object>,
  onSuccess?: () => void
): ((e?: FormEvent<HTMLFormElement>, arg?: ThunkArg) => Promise<void>) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const from = state?.from?.pathname ?? '/';

  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement>,
    arg?: ThunkArg
  ): Promise<void> => {
    e?.preventDefault();

    if (arg === undefined) {
      console.error('Не передан аргумент для Thunk');
      return;
    }

    try {
      const result = await dispatch(actionCreator(arg));

      if ('meta' in result && result.meta.requestStatus === 'fulfilled') {
        onSuccess?.();
        void navigate(from, { replace: true });
      } else {
        console.error('Ошибка:', 'payload' in result ? result.payload : result);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      console.error('Ошибка запроса:', error);
    }
  };

  return handleSubmit;
};

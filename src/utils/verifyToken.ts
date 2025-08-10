import { API } from '@utils/api';

import type { TUser } from '@utils/types';

type TVerifyTokenResult = {
  user: TUser;
  accessToken: string | null;
} | null;

/**
 * Проверка accessToken'а и обновление через refreshToken, если истёк.
 * @param accessToken - токен доступа
 * @param refreshToken - refresh-токен
 * @param signal - сигнал прерывания запроса (AbortController)
 */
export const verifyToken = async (
  accessToken: string,
  refreshToken: string,
  signal?: AbortSignal
): Promise<TVerifyTokenResult> => {
  try {
    const pureToken = accessToken.replace('Bearer ', '');
    const userData = await API.getUser(`Bearer ${pureToken}`, signal);
    return { user: userData.user, accessToken };
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return null;
    }

    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message === 'jwt expired' &&
      refreshToken
    ) {
      const { accessToken: newAccessToken } = await API.refreshToken(refreshToken);
      localStorage.setItem('accessToken', newAccessToken);
      const userData = await API.getUser(newAccessToken);
      return { user: userData.user, accessToken: newAccessToken };
    }

    throw error;
  }
};

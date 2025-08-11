type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export const saveTokens = ({ accessToken, refreshToken }: Tokens): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getTokens = (): {
  accessToken: string | null;
  refreshToken: string | null;
} => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
});

import { API } from '@utils/api.js';

export const verifyToken = async (accessToken, refreshToken, signal) => {
	try {
		const pureToken = accessToken.replace('Bearer ', '');
		const userData = await API.getUser(`Bearer ${pureToken}`, signal);
		return { user: userData.user, accessToken };
	} catch (error) {
		if (error.name === 'AbortError') {
			return null;
		}
		if (error.message === 'jwt expired' && refreshToken) {
			const { accessToken: newAccessToken } =
				await API.refreshToken(refreshToken);
			localStorage.setItem('accessToken', newAccessToken);
			const userData = await API.getUser(newAccessToken);
			return { user: userData.user, accessToken: newAccessToken };
		}
		throw error;
	}
};

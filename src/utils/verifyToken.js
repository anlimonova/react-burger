import { API } from '@utils/api.js';

export const verifyToken = async (accessToken, refreshToken) => {
	try {
		const userData = await API.getUser(accessToken);
		return { user: userData.user, accessToken };
	} catch (error) {
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

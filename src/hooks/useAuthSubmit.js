import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Выполняет экшен авторизации/регистрации и редиректит обратно на защищённый маршрут
 * @param {Function} actionCreator - функция, возвращающая redux action (thunk)
 * @param {Function} [onSuccess] - колбэк при успешном выполнении
 * @returns {Function} - функция handleSubmit
 */
export const useAuthSubmit = (actionCreator, onSuccess) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || '/';

	const handleSubmit = async (e) => {
		e?.preventDefault();
		try {
			const result = await dispatch(actionCreator());

			if (result.meta.requestStatus === 'fulfilled') {
				onSuccess?.();
				navigate(from, { replace: true });
			} else {
				console.error('Ошибка:', result.payload);
			}
		} catch (err) {
			console.error('Ошибка запроса:', err.message);
		}
	};

	return handleSubmit;
};

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '@/services/slices/userSlice';

export const useAuth = () => {
	const dispatch = useDispatch();
	const { user, isAuthChecked } = useSelector((store) => store.user);

	useEffect(() => {
		if (!isAuthChecked) {
			dispatch(checkAuth());
		}
	}, [dispatch, isAuthChecked]);

	return { user, isAuthChecked };
};

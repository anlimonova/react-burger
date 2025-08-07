import { NavLink, Outlet } from 'react-router-dom';
import styles from './profile-layout.module.css';
import { logoutUser } from '@/services/slices/userSlice.js';
import { useDispatch } from 'react-redux';

export const ProfileLayout = () => {
	const dispatch = useDispatch();

	const handleClick = () => {
		const refreshToken = localStorage.getItem('refreshToken');
		dispatch(logoutUser(refreshToken));
	};

	return (
		<section className={styles.profile + ' mt-30'}>
			<nav className={styles.navigation + ' text text_type_main-medium mr-15'}>
				<ul>
					<li>
						<NavLink
							to='/profile'
							end
							className={({ isActive }) =>
								isActive ? styles.link_active : ''
							}>
							Профиль
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/profile/orders'
							className={({ isActive }) =>
								isActive ? styles.link_active : ''
							}>
							История заказов
						</NavLink>
					</li>
					<li>
						<button onClick={handleClick}>Выход</button>
					</li>
				</ul>
				<span className={styles.note + ' text text_type_main-default mt-20'}>
					В этом разделе вы можете изменить свои персональные данные
				</span>
			</nav>

			<Outlet />
		</section>
	);
};

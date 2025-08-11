import { useAppDispatch } from '@/hooks/reduxHooks';
import { NavLink, Outlet } from 'react-router-dom';

import { selectedIngredientsSlice } from '@services/slices/selectedIngredientsSlice.ts';
import { logoutUser } from '@services/slices/userSlice';

import type React from 'react';

import styles from './profile-layout.module.css';

export const ProfileLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleClick = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await dispatch(logoutUser(refreshToken));
      dispatch(selectedIngredientsSlice.actions.resetSelectedIngredients());
    }
  };

  return (
    <section className={`${styles.profile} mt-30`}>
      <nav className={`${styles.navigation} text text_type_main-medium mr-15`}>
        <ul>
          <li>
            <NavLink
              to="/profile"
              end
              className={({ isActive }) => (isActive ? styles.link_active : '')}
            >
              Профиль
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile/orders"
              className={({ isActive }) => (isActive ? styles.link_active : '')}
            >
              История заказов
            </NavLink>
          </li>
          <li>
            <button onClick={() => void handleClick()} type="button">
              Выход
            </button>
          </li>
        </ul>
        <span className={`${styles.note} text text_type_main-default mt-20`}>
          В этом разделе вы можете изменить свои персональные данные
        </span>
      </nav>

      <Outlet />
    </section>
  );
};

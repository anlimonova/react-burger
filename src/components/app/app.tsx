import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { checkAuth } from '@/services/slices/userSlice';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/modals/ingredient-details/ingredient-details';
import { Modal } from '@components/modals/modal/modal';
import { OrderDetails } from '@components/modals/order-details/order-details';
import { PageOverlay } from '@components/page-overlay/page-overlay';
import { OnlyAuth, OnlyUnAuth } from '@components/protected-route/protected-route';
import { Feed } from '@pages/feed/feed';
import { ForgotPassword } from '@pages/forgot-password/forgot-password';
import { Home } from '@pages/home/home';
import { Login } from '@pages/login/login';
import { NotFound404 } from '@pages/not-found-404/not-found-404';
import { OrdersHistory } from '@pages/orders-history/orders-history';
import { ProfileLayout } from '@pages/profile-layout/profile-layout';
import { Profile } from '@pages/profile-layout/profile/profile';
import { Registration } from '@pages/registration/registration';
import { ResetPassword } from '@pages/reset-password/reset-password';
import { fetchIngredients } from '@services/slices/ingredientsSlice';
import { modalSlice } from '@services/slices/modalSlice';

import type { RootState } from '@services/store';
import type { EffectCallback } from 'react';
import type React from 'react';

import styles from './app.module.css';

type TLocationState = { backgroundPath?: string };

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as TLocationState | undefined;
  const backgroundPath = state?.backgroundPath;

  const backgroundLocation = backgroundPath
    ? {
        pathname: backgroundPath,
        search: location.search,
        hash: location.hash,
        state,
        key: location.key ?? 'default-key',
      }
    : location;

  const { ingredients, loading: ingredientsLoading } = useAppSelector(
    (state: RootState) => state.ingredients
  );

  // Проверка авторизации
  useEffect((): ReturnType<EffectCallback> => {
    const controller = new AbortController();
    void dispatch(checkAuth(undefined, { signal: controller.signal }));
    return () => controller.abort();
  }, [dispatch]);

  // Загрузка ингредиентов
  useEffect(() => {
    const promise = dispatch(fetchIngredients());
    return (): void => {
      promise.abort?.();
    };
  }, [dispatch]);

  const handleModalClose = (): void => {
    dispatch(modalSlice.actions.closeModal());
    void navigate(-1);
  };

  if (ingredientsLoading || ingredients.length === 0) {
    return (
      <div className={styles.app}>
        <PageOverlay />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={`${styles.main} pl-5 pr-5`}>
        <Routes location={backgroundLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/feed/:orderNumber" element={<OrderDetails />} />
          <Route path="/ingredients/:ingredientId" element={<IngredientDetails />} />
          <Route path="/login" element={<OnlyUnAuth component={<Login />} />} />
          <Route
            path="/registration"
            element={<OnlyUnAuth component={<Registration />} />}
          />
          <Route
            path="/forgot-password"
            element={<OnlyUnAuth component={<ForgotPassword />} />}
          />
          <Route
            path="/reset-password"
            element={<OnlyUnAuth component={<ResetPassword />} />}
          />

          <Route path="/profile" element={<OnlyAuth component={<ProfileLayout />} />}>
            <Route index element={<Profile />} />
            <Route path="orders" element={<OrdersHistory />} />
          </Route>
          <Route
            path="/profile/orders/:orderNumber"
            element={<OnlyAuth component={<OrderDetails />} />}
          />
          <Route path="*" element={<NotFound404 />} />
        </Routes>

        {backgroundPath && (
          <Routes>
            <Route
              path="/ingredients/:ingredientId"
              element={
                <Modal title="Детали ингредиента" onClose={handleModalClose}>
                  <IngredientDetails modal />
                </Modal>
              }
            />
            <Route
              path="/feed/:orderNumber"
              element={
                <Modal onClose={handleModalClose} isBig>
                  <OrderDetails modal from="feed" />
                </Modal>
              }
            />
            <Route
              path="/profile/orders/:orderNumber"
              element={
                <OnlyAuth
                  component={
                    <Modal onClose={handleModalClose} isBig>
                      <OrderDetails modal from="profile" />
                    </Modal>
                  }
                />
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
};

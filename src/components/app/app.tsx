import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { checkAuth } from '@/services/slices/userSlice';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/modals/ingredient-details/ingredient-details';
import { Modal } from '@components/modals/modal/modal.tsx';
import { PageOverlay } from '@components/page-overlay/page-overlay.tsx';
import { OnlyAuth, OnlyUnAuth } from '@components/protected-route/protected-route';
import { Feed } from '@pages/feed/feed.tsx';
import { ForgotPassword } from '@pages/forgot-password/forgot-password';
import { Home } from '@pages/home/home';
import { Login } from '@pages/login/login';
import { NotFound404 } from '@pages/not-found-404/not-found-404';
import { OrdersHistory } from '@pages/orders-history/orders-history';
import { ProfileLayout } from '@pages/profile-layout/profile-layout';
import { Profile } from '@pages/profile-layout/profile/profile';
import { Registration } from '@pages/registration/registration';
import { ResetPassword } from '@pages/reset-password/reset-password';
import { fetchIngredients } from '@services/slices/ingredientsSlice.ts';
import { modalSlice } from '@services/slices/modalSlice';

import type { RootState } from '@services/store.ts';
import type { EffectCallback } from 'react';
import type React from 'react';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

export const App = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const state = location.state as TLocationState | null;
  const background = state?.background;

  const { ingredients, loading: ingredientsLoading } = useAppSelector(
    (state: RootState) => state.ingredients
  );

  useEffect((): ReturnType<EffectCallback> => {
    const controller = new AbortController();

    void dispatch(checkAuth(undefined, { signal: controller.signal }));

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    const promise = dispatch(fetchIngredients());
    return (): void => {
      promise.abort?.();
    };
  }, [dispatch, ingredients.length]);

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
        <Routes location={background ?? location}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/ingredients/:ingredientId" element={<IngredientDetails />} />
          <Route path="/login" element={<OnlyUnAuth component={<Login />} />}></Route>
          <Route
            path="/registration"
            element={<OnlyUnAuth component={<Registration />} />}
          ></Route>
          <Route
            path="/forgot-password"
            element={<OnlyUnAuth component={<ForgotPassword />} />}
          ></Route>
          <Route
            path="/reset-password"
            element={<OnlyUnAuth component={<ResetPassword />} />}
          ></Route>
          <Route path="profile" element={<OnlyAuth component={<ProfileLayout />} />}>
            <Route index element={<Profile />} />
            <Route path="orders" element={<OrdersHistory />} />
            {/*<Route path='orders/:number' element={<OrderAccepting />} />*/}
          </Route>
          <Route path="/feed" element={<Feed />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>

        {background && (
          <Routes>
            <Route
              path="/ingredients/:ingredientId"
              element={
                <Modal title="Детали ингредиента" onClose={handleModalClose}>
                  <IngredientDetails modal />
                </Modal>
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
};

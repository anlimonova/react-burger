import { useAppSelector } from '@/hooks/reduxHooks.ts';
import { Navigate, useLocation } from 'react-router-dom';

import { PageOverlay } from '@components/page-overlay/page-overlay';

import type { RootState } from '@services/store';
import type { ReactElement } from 'react';
import type React from 'react';
import type { Location } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  component,
}) => {
  const location = useLocation();
  const { user, isAuthChecked } = useAppSelector((store: RootState) => store.user);

  if (!isAuthChecked) {
    return <PageOverlay />;
  }

  if (!onlyUnAuth && !user) {
    // Пользователь не авторизован, но маршрут для авторизованных
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    // Пользователь авторизован, но маршрут только для неавторизованных
    const from = (location.state as { from?: Location })?.from ?? { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return component;
};

export const OnlyAuth = ProtectedRoute;

type OnlyUnAuthProps = {
  component: ReactElement;
};

export const OnlyUnAuth: React.FC<OnlyUnAuthProps> = ({ component }) => (
  <ProtectedRoute onlyUnAuth={true} component={component} />
);

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLoading from '../../../components/admin/AdminLoading';

export default function UserMiddleware() {
  const location = useLocation();
  const { isLoading, jwt_token, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return <AdminLoading />;
  }

  if (!jwt_token || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

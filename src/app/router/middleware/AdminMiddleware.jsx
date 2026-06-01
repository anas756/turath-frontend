import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLoading from '../../../components/admin/AdminLoading';

export default function AdminMiddleware() {
  const location = useLocation();

  const { user, isLoading, jwt_token, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return <AdminLoading />;
  }

  if (!jwt_token || !isAuthenticated) {
    console.log('No valid session found. Redirecting to login...', {
      jwt_token,
      isAuthenticated,
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    console.log('Unauthorized access attempt by user:', user?.userName);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

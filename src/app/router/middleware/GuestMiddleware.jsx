import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLoading from '../../../components/admin/AdminLoading';

export default function GuestMiddleware() {
  const { isLoading, jwt_token, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return <AdminLoading />;
  }

  // Already logged in — redirect to their dashboard
  if (jwt_token && isAuthenticated) {
    if (user?.role === 'admin')
      return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'user') return <Navigate to="/user/home" replace />;
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

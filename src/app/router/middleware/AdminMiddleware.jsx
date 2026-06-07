import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLoading from '../../../components/admin/AdminLoading';

export default function AdminMiddleware() {
  const location = useLocation();
  const { user, jwt_token, isAuthenticated } = useSelector((state) => state.auth);

  if (!jwt_token || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

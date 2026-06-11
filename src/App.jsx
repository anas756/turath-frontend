// App.jsx
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { route } from './app/router/Router';
import { useDispatch, useSelector } from 'react-redux';
import AlertBanner from './components/AlertBanner';
import { getProfile } from './app/services/reduxTollkit/asyncThunks/AuthThunk';
import AdminLoading from './components/admin/AdminLoading';
import Cookies from 'js-cookie';
import './index.css';

export default function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const jwt_token = Cookies.get('jwt_token');


  useEffect(() => {
    if (jwt_token) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  if (jwt_token && isLoading) {
    return <AdminLoading />;
  }

  return (
    <div>
      <RouterProvider router={route} />
      <AlertBanner />
    </div>
  );
}

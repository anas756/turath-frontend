import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { route } from './app/router/Router';
import { useDispatch, useSelector } from 'react-redux';
import AlertBanner from './components/AlertBanner';
import Cookies from 'js-cookie';
import { getProfile } from './app/services/reduxTollkit/asyncThunks/AuthThunk';
import './index.css';

export default function App() {
  const dispatch = useDispatch();
  const { jwt_token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (jwt_token) {
      dispatch(getProfile());
      console.log(user, jwt_token);
    }
  }, [dispatch, jwt_token]);

  return (
    <div>
      <RouterProvider router={route} />
      <AlertBanner />
    </div>
  );
}

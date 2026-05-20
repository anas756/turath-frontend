import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { route } from './app/router/Router';
import { useDispatch } from 'react-redux';
import { setTokenFromCookie } from './app/services/reduxTollkit/Slices/AuthSlice';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkCookie = async () => {
      const cookie = await cookieStore.get('jwt_token');
      if (cookie) {
        dispatch(setTokenFromCookie(cookie.value));
      }
    };

    checkCookie();
  }, [dispatch]);
  return (
    <div>
      <RouterProvider router={route} />
    </div>
  );
}


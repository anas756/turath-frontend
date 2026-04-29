<<<<<<< HEAD
// src/App.jsx
import React from "react";
import Navbar from "./Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <h1>Welcome to my app</h1>
    </div>
  );
}

export default App;
=======
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
>>>>>>> aitmoulay

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { route } from './app/router/Router';

export default function App() {
  return (
    <div>
      <RouterProvider router={route} />
    </div>
  );
}

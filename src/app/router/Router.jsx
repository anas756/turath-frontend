import { createBrowserRouter } from 'react-router-dom';
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import Login from '../../pages/Login';

export const route = createBrowserRouter([
  {
    path: '/users',
    element: <UserLayout />,
    children: [],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

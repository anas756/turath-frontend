import { createBrowserRouter } from 'react-router-dom';
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import Login from '../../pages/Login';
import Home from '../../pages/Home';
import SignUp from '../../pages/SignUp';
import UserHome from '../../pages/user/UserHome';
import Dashboard from '../../pages/admin/Dashboard';

export const route = createBrowserRouter([
  {
    path: '/user/',
    element: <UserLayout />,
    children: [
      {
        path: 'home',
        element: <UserHome />,
      },
    ],
  },
  {
    path: '/admin/',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  { path: '/signup', element: <SignUp /> },
  { path: '/', element: <Login /> },
]);

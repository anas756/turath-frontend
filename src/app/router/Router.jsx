import { createBrowserRouter } from 'react-router-dom';
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import Login from '../../pages/auth/Login';
import Home from '../../pages/Home';
import SignUp from '../../pages/auth/SignUp';
import UserHome from '../../pages/user/UserHome';
import Dashboard from '../../pages/admin/Dashboard';
import VerifyEmail from '../../pages/auth/VerifyEmail';
import EmailConfirmed from '../../pages/auth/EmailConfirmed';
import ForgotPassword from '../../pages/auth/ForgotPassword';
import ResetPassword from '../../pages/auth/ResetPassword';
import ResetTokenConfirmed from '../../pages/auth/ResetTokenConfirmed';
import DigitalLibrary from '../../pages/admin/DigitalLibrary';
import MediaLibrary from '../../pages/admin/MediaLibrary';
import UserManagement from '../../pages/admin/UserManagement';
import ChatLogs from '../../pages/admin/ChatLogs';



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
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'library', element: <DigitalLibrary /> },
      { path: 'media', element: <MediaLibrary /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'chat-logs', element: <ChatLogs /> },
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
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/email-confirmed', element: <EmailConfirmed /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-token-confirmed', element: <ResetTokenConfirmed /> },
  { path: '/update-password', element: <ResetPassword /> },
]);

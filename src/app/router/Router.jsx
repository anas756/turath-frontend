import { createBrowserRouter } from 'react-router-dom';

// Layouts and Middleware
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import AdminMiddleware from './middleware/AdminMiddleware';
import UserMiddleware from './middleware/UserMiddleware';
import GuestMiddleware from './middleware/GuestMiddleware';

// Admin Components
import Dashboard from '../../pages/admin/Dashboard';
import DigitalLibrary from '../../pages/admin/LibraryManagment/DigitalLibrary';
import MediaLibrary from '../../pages/admin/mediaManagment/MediaLibrary';
import Users from '../../pages/admin/userManagment/Users';
import ChatLogs from '../../pages/admin/ChatLogs';

// Auth Components
import Login from '../../pages/auth/Login';
import SignUp from '../../pages/auth/SignUp';
import VerifyEmail from '../../pages/auth/VerifyEmail';
import EmailConfirmed from '../../pages/auth/EmailConfirmed';
import ForgotPassword from '../../pages/auth/ForgotPassword';
import ResetPassword from '../../pages/auth/ResetPassword';
import ResetTokenConfirmed from '../../pages/auth/ResetTokenConfirmed';

// General Components
import Home from '../../pages/Home';
import UserHome from '../../pages/user/UserHome';
import UnauthorizedPage from '../../pages/UnauthorizedPage';
import DashboardRedirect from './middleware/DashboardRedirect';
import NotFoundPage from '../../pages/NotFoundPage';

export const route = createBrowserRouter([
  // Public home
  { path: '/home', element: <Home /> },
  { path: '/', element: <DashboardRedirect /> },

  // Guest-only routes (redirect away if already logged in)
  {
    element: <GuestMiddleware />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },

  // Auth
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/email-confirmed', element: <EmailConfirmed /> },
  { path: '/reset-token-confirmed', element: <ResetTokenConfirmed /> },
  { path: '/update-password', element: <ResetPassword /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },

  //  User routes
  {
    element: <UserMiddleware />,
    children: [
      {
        path: '/user/',
        element: <UserLayout />,
        children: [{ path: 'home', element: <UserHome /> }],
      },
    ],
  },

  // Admin routs
  {
    element: <AdminMiddleware />,
    children: [
      {
        path: '/admin/',
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'library', element: <DigitalLibrary /> },
          { path: 'media', element: <MediaLibrary /> },
          { path: 'users', element: <Users /> },
          { path: 'chat-logs', element: <ChatLogs /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);

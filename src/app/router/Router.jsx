import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminMiddleware from './middleware/AdminMiddleware';

const Dashboard = lazy(() => import('../../pages/admin/Dashboard'));
const DigitalLibrary = lazy(
  () => import('../../pages/admin/LibraryManagment/DigitalLibrary')
);
const MediaLibrary = lazy(() => import('../../pages/admin/MediaLibrary'));
const Users = lazy(() => import('../../pages/admin/userManagment/Users'));
const ChatLogs = lazy(() => import('../../pages/admin/ChatLogs'));

const Login = lazy(() => import('../../pages/auth/Login'));
const SignUp = lazy(() => import('../../pages/auth/SignUp'));
const VerifyEmail = lazy(() => import('../../pages/auth/VerifyEmail'));
const EmailConfirmed = lazy(() => import('../../pages/auth/EmailConfirmed'));
const ForgotPassword = lazy(() => import('../../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../../pages/auth/ResetPassword'));
const ResetTokenConfirmed = lazy(
  () => import('../../pages/auth/ResetTokenConfirmed')
);

const Home = lazy(() => import('../../pages/Home'));
const UserHome = lazy(() => import('../../pages/user/UserHome'));

const UnauthorizedPage = lazy(() => import('../../pages/UnauthorizedPage'));

export const route = createBrowserRouter([
  {
    path: '/user/',
    element: <UserLayout />,
    children: [
      {
        path: 'home',
        element: (
          <Suspense fallback={<div>Loading User Home...</div>}>
            <UserHome />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <AdminMiddleware />,
    children: [
      {
        path: '/admin/',
        element: <AdminLayout />,
        children: [
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<AdminLoading />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: 'library',
            element: (
              <Suspense fallback={<AdminLoading />}>
                <DigitalLibrary />
              </Suspense>
            ),
          },
          {
            path: 'media',
            element: (
              <Suspense fallback={<AdminLoading />}>
                <MediaLibrary />
              </Suspense>
            ),
          },
          {
            path: 'users',
            element: (
              <Suspense fallback={<AdminLoading />}>
                <Users />
              </Suspense>
            ),
          },
          {
            path: 'chat-logs',
            element: (
              <Suspense fallback={<AdminLoading />}>
                <ChatLogs />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/home',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmail />
      </Suspense>
    ),
  },
  {
    path: '/email-confirmed',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <EmailConfirmed />
      </Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: '/reset-token-confirmed',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ResetTokenConfirmed />
      </Suspense>
    ),
  },
  {
    path: '/update-password',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
      </Suspense>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UnauthorizedPage />
      </Suspense>
    ),
  },
]);

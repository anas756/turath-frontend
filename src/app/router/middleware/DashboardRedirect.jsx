// app/router/middleware/DashboardRedirect.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AdminLoading from '../../../components/admin/AdminLoading';

export default function DashboardRedirect() {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/home" />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  if (user.role === 'user') return <Navigate to="/user/home" />;

  return <Navigate to="/home" />;
}

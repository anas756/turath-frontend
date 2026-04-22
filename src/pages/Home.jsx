import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../app/services/reduxTollkit/Slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { api } from '../app/services/lib/Api';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Tell Laravel to invalidate the token on the server
      const res = await api.logout();

      // 2. If server confirms (200 OK), clean up the frontend
      if (res.status === 200) {
        dispatch(logout()); // <--- CRITICAL FIX: Add the parentheses ()
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Optional: force logout even if API fails to keep UI secure
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Welcome to ATMMOVIES</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

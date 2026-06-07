import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleGoHome = () => {
    if (!isAuthenticated) return navigate('/login');
    if (user?.role === 'admin') return navigate('/admin/dashboard');
    return navigate('/user/home');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <h1
        style={{ fontSize: '6rem', fontWeight: 700, margin: 0, opacity: 0.15 }}
      >
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 500, margin: 0 }}>
        Page not found
      </h2>
      <p style={{ color: '#888', margin: 0 }}>
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={handleGoHome}
        style={{
          marginTop: '8px',
          padding: '10px 24px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Go to dashboard
      </button>
    </div>
  );
}

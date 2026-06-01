import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      {/* Nfs l-photo panel bhal login */}
      <div
        className="auth-photo"
        style={{ backgroundImage: 'url(/path-to-your-image.jpg)' }}
      >
        <div className="photo-overlay" />
      </div>

      {/* Form panel content (li howa 403 page) */}
      <div className="auth-form-panel">
        <div className="form-inner verify-inner">
          {/* Icon d-error */}
          <div className="verify-icon" style={{ background: '#fdf0ee' }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1
            className="auth-title"
            style={{ fontSize: '1.8rem', marginBottom: '1rem' }}
          >
            Access Denied
          </h1>

          <p className="verify-desc" style={{ marginBottom: '2.5rem' }}>
            You do not have permission to view this page. Please check your
            credentials or return to the dashboard.
          </p>

          <button
            onClick={() => navigate('/user/home')}
            className="btn-cta"
            style={{ width: '100%' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

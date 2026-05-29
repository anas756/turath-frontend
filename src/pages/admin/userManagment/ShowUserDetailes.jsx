import React from 'react';
import PageHeader from '../../../components/admin/PageHeader';

export default function ShowUserDetails({ user, onClose }) {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <PageHeader
        title="User Details"
        subtitle={`Viewing details for ${user.name}`}
        action={
          <button
            onClick={onClose}
            className="btn-add-doc"
            style={{ cursor: 'pointer' }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ marginRight: '5px', verticalAlign: 'middle' }}
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Close
          </button>
        }
      />

      <div className="section-card">
        <div style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <div
              className="curator-avatar"
              style={{ width: '80px', height: '80px', fontSize: '32px' }}
            >
              {user.name ? user.name.substring(0, 2).toUpperCase() : '??'}
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{user.name}</h2>
              <p style={{ margin: '5px 0 0', color: '#666' }}>
                @{user.userName}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
            }}
          >
            <div>
              <h3>Account Information</h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong>{' '}
                <span
                  className={`chip ${user.role === 'admin' ? 'chip-manuscript' : 'chip-media'}`}
                >
                  {user.role}
                </span>
              </p>
              <p>
                <strong>Status:</strong> {user.confirmed ? 'Active' : 'Pending'}
              </p>
            </div>

            <div>
              <h3>Activity</h3>
              <p>
                <strong>Joined:</strong> {formatDate(user.created_at)}
              </p>
              <p>
                <strong>Last Login:</strong> {formatDate(user.last_login)}
              </p>
              <p>
                <strong>Email Verified:</strong>{' '}
                {user.email_verified_at
                  ? formatDate(user.email_verified_at)
                  : 'Not verified'}
              </p>
            </div>
          </div>

          {user.bio && (
            <div style={{ marginTop: '20px' }}>
              <h3>Bio</h3>
              <p>{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

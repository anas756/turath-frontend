import React from 'react';
import PageHeader from '../../../components/admin/PageHeader';
import StatusBadge from '../../../components/admin/StatusBadge';

export default function ShowUserDetails({ user, onClose }) {
  if (!user) return null;

  // Safe Date Formatter helper sequence
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

  // ✅ FIX: Clean initials extractor for better dynamic UI presentation
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isSystemAdmin = user.role?.toLowerCase() === 'admin';

  return (
    <div>
      <PageHeader
        title="User Details"
        subtitle={`Viewing details and permissions for @${user.userName || 'user'}`}
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
        <div style={{ padding: '24px' }}>
          {/* Header Banner Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '32px',
              borderBottom: '1px solid var(--border-color, #eaeaea)',
              paddingBottom: '24px',
            }}
          >
            {/* Optimized dynamic initials background bubble */}
            <div
              className="curator-avatar"
              style={{
                width: '72px',
                height: '72px',
                fontSize: '28px',
                borderRadius: '50%',
              }}
            >
              {getInitials(user.name)}
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  textTransform: 'capitalize',
                  fontWeight: 600,
                }}
              >
                {user.name}
              </h2>
              <p
                style={{
                  margin: '4px 0 0',
                  color: 'var(--on-surface-muted, #666)',
                  fontSize: '0.9rem',
                }}
              >
                @{user.userName}
              </p>
            </div>
          </div>

          {/* Grid Information Grid Wrapper */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Account Metadata Segment */}
            <div>
              <h3
                style={{
                  fontSize: '1.05rem',
                  marginBottom: '16px',
                  fontWeight: 600,
                }}
              >
                Account Information
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--on-surface-muted, #555)' }}>
                    Email:
                  </strong>{' '}
                  {user.email}
                </p>
                <p
                  style={{
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <strong style={{ color: 'var(--on-surface-muted, #555)' }}>
                    Role:
                  </strong>{' '}
                  <span
                    className={`chip ${isSystemAdmin ? 'chip-manuscript' : 'chip-media'}`}
                  >
                    {user.role}
                  </span>
                </p>
                <p
                  style={{
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <strong style={{ color: 'var(--on-surface-muted, #555)' }}>
                    Status:
                  </strong>{' '}
                  <StatusBadge status={user.confirmed ? 'Active' : 'Pending'} />
                </p>
              </div>
            </div>

            {/* Application Access/Activity Metrics */}
            <div>
              <h3
                style={{
                  fontSize: '1.05rem',
                  marginBottom: '16px',
                  fontWeight: 600,
                }}
              >
                Activity
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--on-surface-muted, #555)' }}>
                    Joined:
                  </strong>{' '}
                  {formatDate(user.created_at)}
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--on-surface-muted, #555)' }}>
                    Last Login:
                  </strong>{' '}
                  {formatDate(user.last_login)}
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--on-surface-muted, #555)' }}>
                    Email Verified:
                  </strong>{' '}
                  {user.email_verified_at ? (
                    <span style={{ color: '#2e7d32', fontWeight: 500 }}>
                      {formatDate(user.email_verified_at)}
                    </span>
                  ) : (
                    <span style={{ color: '#d32f2f', fontWeight: 500 }}>
                      Not verified
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Optional Bio Segment Block */}
          {user.bio && (
            <div
              style={{
                marginTop: '32px',
                borderTop: '1px solid var(--border-color, #eaeaea)',
                paddingTop: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.05rem',
                  marginBottom: '12px',
                  fontWeight: 600,
                }}
              >
                Bio
              </h3>
              <p style={{ margin: 0, color: '#444', lineHeight: 1.6 }}>
                {user.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

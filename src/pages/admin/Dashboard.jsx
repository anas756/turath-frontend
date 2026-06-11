import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../app/services/reduxTollkit/asyncThunks/DashboardThunk';
import {
  selectDashboardUsers,
  selectDashboardDocuments,
  selectDashboardMedia,
  selectDashboardRecent,
  selectDashboardLoading,
  selectDashboardError,
} from '../../app/services/reduxTollkit/Slices/DashboardSlice';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getTypeIcon = (type) => {
  if (type === 'document')
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  if (type === 'media')
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  if (type === 'user')
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
};

const getIconColors = (type) => {
  if (type === 'document')
    return { bg: 'rgba(99,102,241,0.12)', color: '#6366f1' };
  if (type === 'media')
    return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' };
  if (type === 'user') return { bg: 'rgba(16,185,129,0.12)', color: '#10b981' };
  return { bg: 'rgba(99,102,241,0.12)', color: '#6366f1' };
};

const getChipColors = (type) => {
  if (type === 'document')
    return { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' };
  if (type === 'media') return { bg: 'rgba(245,158,11,0.1)', color: '#d97706' };
  if (type === 'user') return { bg: 'rgba(16,185,129,0.1)', color: '#059669' };
  return { bg: '#f1f5f9', color: '#64748b' };
};

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const getCurator = (item) => {
  if (item.type === 'document') return String(item.authors ?? '—');
  if (item.type === 'media') return String(item.curator ?? '—');
  if (item.type === 'user') return String(item.subtitle ?? '—');
  return '—';
};

const getAvatarColor = (type) => {
  if (type === 'document') return { bg: '#6366f1', color: '#fff' };
  if (type === 'media') return { bg: '#f59e0b', color: '#fff' };
  if (type === 'user') return { bg: '#10b981', color: '#fff' };
  return { bg: '#94a3b8', color: '#fff' };
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const dispatch = useDispatch();
  const users = useSelector(selectDashboardUsers);
  const documents = useSelector(selectDashboardDocuments);
  const media = useSelector(selectDashboardMedia);
  const recent = useSelector(selectDashboardRecent);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p className="error-text">{error}</p>;

  const STATS = [
    {
      label: 'Total Users',
      value: users.total.toLocaleString(),
      meta: `${users.trend === 'up' ? '↑ +' : '↓ '}${Math.abs(users.percentage)}% vs last month`,
      type: users.trend === 'up' ? 'positive' : 'negative',
    },
    {
      label: 'Archived Documents',
      value: documents.total.toLocaleString(),
      meta: `${documents.trend === 'up' ? '↑ +' : '↓ '}${Math.abs(documents.percentage)}% vs last month`,
      type: documents.trend === 'up' ? 'positive' : 'negative',
    },
    {
      label: 'Media Assets',
      value: media.total.toLocaleString(),
      meta: `${media.trend === 'up' ? '↑ +' : '↓ '}${Math.abs(media.percentage)}% vs last month`,
      type: media.trend === 'up' ? 'positive' : 'negative',
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Curator Overview</h1>
        <p className="page-subtitle">
          System status and recent architectural archive additions.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
            <p className={`stat-meta ${s.type}`}>{s.meta}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Recently Added Content</h2>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '0.5rem 0',
          }}
        >
          {recent.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                color: 'var(--on-surface-muted)',
                padding: '2rem',
              }}
            >
              No recent activity
            </p>
          )}

          {recent.map((item, index) => {
            const iconColors = getIconColors(item.type);
            const chipColors = getChipColors(item.type);
            const avatarColors = getAvatarColor(item.type);
            const curator = getCurator(item);

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--surface-high, #f8fafc)',
                  border: '1px solid var(--border, #e2e8f0)',
                  transition: 'box-shadow 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 4px 16px rgba(0,0,0,0.06)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                {/* Type Icon */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '0.625rem',
                    backgroundColor: iconColors.bg,
                    color: iconColors.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getTypeIcon(item.type)}
                </div>

                {/* Title + subtitle */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'var(--on-surface, #1e293b)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: 'var(--on-surface-muted, #94a3b8)',
                      marginTop: '2px',
                    }}
                  >
                    {item.subtitle ?? '—'}
                  </p>
                </div>

                {/* Type chip */}
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: chipColors.bg,
                    color: chipColors.color,
                    textTransform: 'capitalize',
                    flexShrink: 0,
                  }}
                >
                  {item.type}
                </span>

                {/* Curator / Author */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexShrink: 0,
                    minWidth: '110px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: avatarColors.bg,
                      color: avatarColors.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(curator)}
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--on-surface-muted, #64748b)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '80px',
                    }}
                  >
                    {curator}
                  </span>
                </div>

                {/* Date */}
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--on-surface-muted, #94a3b8)',
                    flexShrink: 0,
                    minWidth: '90px',
                    textAlign: 'right',
                  }}
                >
                  {formatDate(item.created_at)}
                </span>

                {/* Action */}
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '0.375rem',
                    color: 'var(--on-surface-muted, #94a3b8)',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

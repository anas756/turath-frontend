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
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

const getIconStyle = (type) => {
  if (type === 'document') return 'blue';
  if (type === 'media') return 'gold';
  if (type === 'user') return 'terrac';
  return 'blue';
};

const getChipStyle = (type) => {
  if (type === 'document') return 'chip-manuscript';
  if (type === 'media') return 'chip-media';
  if (type === 'user') return 'chip-arch';
  return '';
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
  if (item.type === 'document') return item.authors ?? '—';
  if (item.type === 'media') return item.curator ?? '—';
  if (item.type === 'user') return item.role ?? '—';
  return '—';
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

      {/* Recent content */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Recently Added Content</h2>
          <button className="btn-view-all">View All →</button>
        </div>

        <table className="content-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date Added</th>
              <th>Curator / Author</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="doc-title-wrap">
                    <div className={`doc-icon ${getIconStyle(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <span className="doc-title-text">{item.title}</span>
                  </div>
                </td>
                <td>
                  <span className={`chip ${getChipStyle(item.type)}`}>
                    {item.subtitle ?? item.type}
                  </span>
                </td>
                <td>
                  <span className="date-text">
                    {formatDate(item.created_at)}
                  </span>
                </td>
                <td>
                  <div className="curator-wrap">
                    <div className="curator-avatar">
                      {getInitials(getCurator(item))}
                    </div>
                    {getCurator(item)}
                  </div>
                </td>
                <td>
                  <button className="action-btn">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

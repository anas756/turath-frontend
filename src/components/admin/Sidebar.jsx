import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/admin.css';
import { useSelector } from 'react-redux';

const NAV = [
  {
    label: 'Overview',
    path: '/admin/dashboard',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Digital Library',
    path: '/admin/library',
    icon: (
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
    ),
  },
  {
    label: 'Media Library',
    path: '/admin/media',
    icon: (
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
    ),
  },
  {
    label: 'User Management',
    path: '/admin/users',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'AI Chat Logs',
    path: '/admin/chat-logs',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const name     = user?.name || 'Admin User';
  const role     = user?.role || 'Curator Access';
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const handleNavigate = () => onClose?.();

  return (
    <>
      <aside className={`sidebar${isOpen ? ' is-open' : ''}`}>
        <div className="sidebar-brand-row">
          <NavLink
            to="/admin/dashboard"
            className="sidebar-brand"
            onClick={handleNavigate}
          >
            <span className="sidebar-brand-icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 21v-8h6v8" />
              </svg>
            </span>
            <span className="sidebar-brand-text">
              <span className="sidebar-brand-name">Turath</span>
              <span className="sidebar-brand-sub">Admin Backoffice</span>
            </span>
          </NavLink>

          <button
            type="button"
            className="sidebar-close"
            aria-label="Close admin navigation"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav — unchanged */}
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>



        {/* Profile */}
        <button
          type="button"
          className="sidebar-user"
          onClick={() => {
            navigate('/admin/profile');
            handleNavigate();
          }}
        >
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{name}</span>
            <span className="sidebar-user-role">{role}</span>
          </div>
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            style={{ marginLeft: 'auto', color: 'var(--on-surface-muted)' }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </aside>
    </>
  );
}

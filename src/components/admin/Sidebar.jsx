import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/admin.css';
import NewEntryModal from './NewEntryModal';
import ProfilePanel from './ProfilePanel';

const NAV = [
  {
    label: 'Overview',
    path: '/admin/dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    label: 'Digital Library',
    path: '/admin/library',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    label: 'Media Library',
    path: '/admin/media',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  },
  {
    label: 'User Management',
    path: '/admin/users',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    label: 'AI Chat Logs',
    path: '/admin/chat-logs',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
];

export default function Sidebar() {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <aside className="sidebar">
        {/* Brand — unchanged */}
        <div className="sidebar-brand">
          {/* ... same as before ... */}
        </div>

        {/* Nav — unchanged */}
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* New Entry button — now opens modal */}
        <button className="btn-new-entry" onClick={() => setShowNewEntry(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Entry
        </button>

        {/* Bottom links — unchanged */}
        <div className="sidebar-bottom">
          <button className="sidebar-nav-item">...</button>
          <button className="sidebar-nav-item">...</button>
        </div>

        {/* Profile — now opens panel */}
        <div className="sidebar-user" onClick={() => setShowProfile(true)}>
          <div className="sidebar-avatar">A</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Admin User</span>
            <span className="sidebar-user-role">Curator Access</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', color: 'var(--on-surface-muted)' }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </aside>

      {/* Modals — rendered outside sidebar so they overlay everything */}
      {showNewEntry && <NewEntryModal onClose={() => setShowNewEntry(false)} />}
      {showProfile  && <ProfilePanel  onClose={() => setShowProfile(false)} />}
    </>
  );
}
import React, { useState } from 'react';
import { users } from '../../data/admin/users';
// When dynamic: dispatch(fetchUsers())
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';

const ROLES = ['All', 'Admin', 'Curator', 'Viewer'];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState('All');

  // When dynamic: replace with Redux state
  const filtered = users.filter(u => {
    const matchesRole = activeRole === 'All' || u.role === activeRole;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Manage curators, admins and viewer access to the archive."
        action={
          <button className="btn-add-doc">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Invite User
          </button>
        }
      />

      <div className="filter-bar">
        <div className="filter-chips">
          {ROLES.map(r => (
            <button
              key={r}
              className={`filter-chip ${activeRole === r ? 'active' : ''}`}
              onClick={() => setActiveRole(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="filter-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">{filtered.length} Users</h2>
        </div>
        <table className="content-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="curator-avatar">{user.initials}</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{user.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-muted)' }}>@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`chip ${user.role === 'Admin' ? 'chip-manuscript' : user.role === 'Curator' ? 'chip-media' : 'chip-arch'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="date-text">{user.email}</td>
                <td className="date-text">{user.lastLogin}</td>
                <td className="date-text">{user.joined}</td>
                <td><StatusBadge status={user.status} /></td>
                <td>
                  <button className="action-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
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
import React from 'react';

// When dynamic: replace this with data from Redux store (state.auth.user)
const ADMIN = {
  name: 'Admin User',
  username: 'admin_user',
  email: 'admin@turath.ma',
  role: 'Curator Access',
  initials: 'A',
  joined: 'November 2022',
  documentsAdded: 142,
  mediaUploaded: 38,
  lastLogin: 'Today, 00:14',
};

export default function ProfilePanel({ onClose }) {
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />

      <div className="profile-panel">
        {/* Header */}
        <div className="profile-panel-header">
          <h2 className="modal-title">My Profile</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Avatar + identity */}
        <div className="profile-identity">
          <div className="profile-avatar-lg">{ADMIN.initials}</div>
          <div>
            <p className="profile-name">{ADMIN.name}</p>
            <p className="profile-role">{ADMIN.role}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="profile-info-block">
          <div className="profile-info-row">
            <span className="profile-info-label">Username</span>
            <span className="profile-info-value">@{ADMIN.username}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value">{ADMIN.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Member since</span>
            <span className="profile-info-value">{ADMIN.joined}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Last login</span>
            <span className="profile-info-value">{ADMIN.lastLogin}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{ADMIN.documentsAdded}</span>
            <span className="profile-stat-label">Documents Added</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{ADMIN.mediaUploaded}</span>
            <span className="profile-stat-label">Media Uploaded</span>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button className="btn-profile-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </button>
          <button className="btn-profile-logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
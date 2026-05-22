import React from 'react';
import { useNavigate } from 'react-router-dom';

const ENTRY_TYPES = [
  {
    id: 'document',
    label: 'Document',
    description: 'Add a manuscript, archive, or written record',
    path: '/admin/library/new',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    color: '#004e8a',
    bg: '#e8f0f8',
  },
  {
    id: 'media',
    label: 'Media Asset',
    description: 'Upload an image, audio recording or video',
    path: '/admin/media/new',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    color: '#63461d',
    bg: '#f5ead6',
  },
  {
    id: 'user',
    label: 'Invite User',
    description: 'Grant a curator or viewer access to the archive',
    path: '/admin/users/invite',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
    ),
    color: '#9f402d',
    bg: '#faeae7',
  },
];

export default function NewEntryModal({ onClose }) {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">New Entry</h2>
            <p className="modal-subtitle">What would you like to add to the archive?</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-options">
          {ENTRY_TYPES.map((type) => (
            <button
              key={type.id}
              className="modal-option"
              onClick={() => handleSelect(type.path)}
            >
              <div className="modal-option-icon" style={{ background: type.bg, color: type.color }}>
                {type.icon}
              </div>
              <div className="modal-option-text">
                <span className="modal-option-label">{type.label}</span>
                <span className="modal-option-desc">{type.description}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--on-surface-muted)', flexShrink: 0 }}>
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
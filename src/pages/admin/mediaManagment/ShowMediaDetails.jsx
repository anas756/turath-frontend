import React from 'react';

const s = {
  header: {
    fontSize: '1.25rem',
    marginBottom: '1.5rem',
    color: '#1a1a1a',
    fontWeight: '700',
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  label: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  value: { fontSize: '0.95rem', color: '#374151', fontWeight: '500' },
  actions: { marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' },
  btn: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default function ShowMediaDetails({ media, onClose }) {
  if (!media) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h3 style={s.header}>Asset Details: {media.title}</h3>

      <div style={s.grid}>
        <div style={s.field}>
          <span style={s.label}>Type</span>
          <span style={s.value}>{media.type}</span>
        </div>
        <div style={s.field}>
          <span style={s.label}>Format</span>
          <span style={s.value}>{media.format?.toUpperCase() || 'N/A'}</span>
        </div>
        <div style={s.field}>
          <span style={s.label}>Curator</span>
          <span style={s.value}>
            {media.curator?.name || media.curator || 'Unassigned'}
          </span>
        </div>
        <div style={s.field}>
          <span style={s.label}>Status</span>
          <span style={s.value}>{media.status?.toUpperCase()}</span>
        </div>
        <div style={s.field}>
          <span style={s.label}>Resolution</span>
          <span style={s.value}>{media.resolution || 'N/A'}</span>
        </div>
        <div style={s.field}>
          <span style={s.label}>Created At</span>
          <span style={s.value}>
            {new Date(media.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div style={s.actions}>
        <button style={s.btn} onClick={onClose}>
          Close Details
        </button>
      </div>
    </div>
  );
}

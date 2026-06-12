import React from 'react';
import StatusBadge from '../../../components/admin/StatusBadge';

const formatDate = (str) => {
  if (!str) return null;
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getInitials = (name) => {
  if (!name) return '??';
  return name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
};

// ── Shared style tokens — identical to ShowMediaDetails ───────────────────────
const m = {
  container: { padding: 'clamp(1rem, 4vw, 2rem)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' },
  title:    { fontSize: '1.5rem', fontWeight: 600, color: 'var(--on-surface)', margin: 0 },
  subtitle: { color: 'var(--on-surface-muted)', fontSize: '0.85rem', marginTop: '0.25rem' },
  closeBtn: {
    background: 'var(--surface-low)', border: 'none',
    width: '32px', height: '32px', borderRadius: '50%',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  identityCard: {
    background: 'var(--surface-white)', border: '1px solid var(--surface-high)',
    borderRadius: '1rem', padding: '1.25rem 1.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap',
  },
  avatarRow:  { display: 'flex', alignItems: 'center', gap: '1rem' },
  avatar: {
    width: '48px', height: '48px', borderRadius: '50%',
    background: 'var(--primary-gradient)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Noto Serif', serif", fontSize: '1rem', fontWeight: 600,
    color: '#fff', flexShrink: 0,
  },
  assetTitle: { fontFamily: "'Noto Serif', serif", fontSize: '1.05rem', fontWeight: 600, color: 'var(--on-surface)', margin: 0 },
  assetMeta:  { fontSize: '0.78rem', color: 'var(--on-surface-muted)', marginTop: '0.2rem' },
  rolePill: {
    display: 'inline-flex', alignItems: 'center',
    padding: '0.22rem 0.85rem', borderRadius: '9999px',
    fontSize: '0.72rem', fontWeight: 700,
    background: 'rgba(0,78,138,0.08)', color: 'var(--primary)',
    border: '1px solid rgba(0,78,138,0.14)', flexShrink: 0,
  },
  grid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginBottom: '1.25rem' },
  card:     { background: 'var(--surface-white)', border: '1px solid var(--surface-high)', borderRadius: '1rem', padding: '1.25rem' },
  cardFull: { background: 'var(--surface-white)', border: '1px solid var(--surface-high)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.25rem' },
  secLabel: { fontSize: '0.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-muted)', marginBottom: '0.85rem' },
  list:     { border: '1px solid var(--surface-low)', borderRadius: '0.625rem', overflow: 'hidden' },
  row:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem', borderBottom: '1px solid var(--surface-low)' },
  rowLast:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem' },
  lbl:      { fontSize: '0.75rem', color: 'var(--on-surface-muted)', fontWeight: 500 },
  val:      { fontSize: '0.82rem', color: 'var(--on-surface)', fontWeight: 600 },
  valMuted: { fontSize: '0.82rem', color: 'var(--on-surface-muted)', fontStyle: 'italic' },
  descText:  { fontSize: '0.85rem', color: 'var(--on-surface)', lineHeight: 1.7, margin: 0 },
  descMuted: { fontSize: '0.85rem', color: 'var(--on-surface-muted)', fontStyle: 'italic' },
  footer:     { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--surface-low)' },
  editBtn: {
    padding: '0.55rem 1.4rem', borderRadius: '9999px',
    background: 'var(--primary-gradient)', color: '#fff',
    border: 'none', cursor: 'pointer',
    fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: '6px',
  },
};

const Val = ({ value }) => value
  ? <span style={m.val}>{value}</span>
  : <span style={m.valMuted}>—</span>;

export default function ShowUserDetails({ user, onClose, onEdit }) {
  if (!user) return null;

  const joinedAt   = formatDate(user.created_at);
  const lastLogin  = formatDate(user.last_login || user.last_login_at);
  const verifiedAt = formatDate(user.email_verified_at);
  const initials   = getInitials(user.name);

  return (
    <div style={m.container}>

      {/* Header */}
      <div style={m.header}>
        <div>
          <h2 style={m.title}>User Details</h2>
          <p style={m.subtitle}>Account and activity information</p>
        </div>
        <button type="button" onClick={onClose} style={m.closeBtn}>✕</button>
      </div>

      {/* Identity card */}
      <div style={m.identityCard}>
        <div style={m.avatarRow}>
          <div style={m.avatar}>{initials}</div>
          <div>
            <p style={m.assetTitle}>{user.name || '—'}</p>
            <p style={m.assetMeta}>@{user.userName || user.username || '—'} · {user.email || '—'}</p>
          </div>
        </div>
        {user.role && <span style={m.rolePill}>{user.role}</span>}
      </div>

      {/* Two-column info grid */}
      <div style={m.grid}>

        <div style={m.card}>
          <p style={m.secLabel}>Account Information</p>
          <div style={m.list}>
            <div style={m.row}>
              <span style={m.lbl}>Email</span>
              <Val value={user.email} />
            </div>
            <div style={m.row}>
              <span style={m.lbl}>Role</span>
              {user.role
                ? <span style={m.rolePill}>{user.role}</span>
                : <span style={m.valMuted}>—</span>
              }
            </div>
            <div style={m.rowLast}>
              <span style={m.lbl}>Status</span>
              <StatusBadge status={user.confirmed ? 'Active' : 'Pending'} />
            </div>
          </div>
        </div>

        <div style={m.card}>
          <p style={m.secLabel}>Activity</p>
          <div style={m.list}>
            <div style={m.row}>
              <span style={m.lbl}>Joined</span>
              <Val value={joinedAt} />
            </div>
            <div style={m.row}>
              <span style={m.lbl}>Last login</span>
              <Val value={lastLogin} />
            </div>
            <div style={m.rowLast}>
              <span style={m.lbl}>Email verified</span>
              {verifiedAt
                ? <span style={{ ...m.val, color: '#15803d' }}>{verifiedAt}</span>
                : <span style={{ ...m.valMuted, color: 'var(--secondary)' }}>Not verified</span>
              }
            </div>
          </div>
        </div>

      </div>

      {/* Bio — only if present */}
      {user.bio && (
        <div style={{ ...m.cardFull, marginBottom: '1.5rem' }}>
          <p style={m.secLabel}>Bio</p>
          <p style={m.descText}>{user.bio}</p>
        </div>
      )}

      {/* Footer */}
      <div style={m.footer}>
        {onEdit && (
          <button style={m.editBtn} onClick={() => onEdit(user)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit User
          </button>
        )}
      </div>

    </div>
  );
}

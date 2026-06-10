import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../app/services/reduxTollkit/asyncThunks/AuthThunk';
import PageHeader from '../../components/admin/PageHeader';

const m = {
  page: { padding: '2rem' },

  // ── Top card ───────────────────────────────────────────────────────────────
  topCard: {
    background: 'var(--surface-white)',
    borderRadius: '1rem',
    boxShadow: 'var(--shadow-lift)',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  banner: {
    background: 'var(--primary-gradient)',
    height: '100px',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerPattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.07,
    backgroundImage: `repeating-linear-gradient(
      45deg, transparent, transparent 18px,
      rgba(255,255,255,0.9) 18px, rgba(255,255,255,0.9) 19px
    )`,
  },
  identityRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: '0 2rem',
    marginTop: '-2.25rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'var(--primary-gradient)',
    border: '4px solid var(--surface-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Noto Serif', serif",
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#fff',
    boxShadow: '0 4px 16px rgba(0,78,138,0.2)',
    flexShrink: 0,
  },
  nameBlock: { paddingBottom: '0.35rem' },
  name: {
    fontFamily: "'Noto Serif', serif",
    fontSize: '1.2rem',
    fontWeight: 600,
    color: 'var(--on-surface)',
    margin: 0,
    lineHeight: 1.3,
  },
  handle: {
    fontSize: '0.78rem',
    color: 'var(--on-surface-muted)',
    marginTop: '0.2rem',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.85rem',
    borderRadius: '9999px',
    fontSize: '0.72rem',
    fontWeight: 700,
    background: 'rgba(0,78,138,0.08)',
    color: 'var(--primary)',
    border: '1px solid rgba(0,78,138,0.14)',
    alignSelf: 'flex-end',
    marginBottom: '0.35rem',
  },

  // ── Two-column layout ──────────────────────────────────────────────────────
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },

  // ── Info card ──────────────────────────────────────────────────────────────
  card: {
    background: 'var(--surface-white)',
    borderRadius: '1rem',
    boxShadow: 'var(--shadow-lift)',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--on-surface-muted)',
    marginBottom: '1rem',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--surface-high)',
    borderRadius: '0.625rem',
    overflow: 'hidden',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--surface-low)',
  },
  infoRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
  },
  infoLabel: {
    fontSize: '0.75rem',
    color: 'var(--on-surface-muted)',
    fontWeight: 500,
  },
  infoValue: {
    fontSize: '0.82rem',
    color: 'var(--on-surface)',
    fontWeight: 600,
  },

  // ── Danger zone ────────────────────────────────────────────────────────────
  dangerCard: {
    background: 'var(--surface-white)',
    borderRadius: '1rem',
    boxShadow: 'var(--shadow-lift)',
    padding: '1.5rem',
    gridColumn: 'span 2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  dangerText: {
    fontSize: '0.85rem',
    color: 'var(--on-surface-muted)',
    marginTop: '0.2rem',
  },
  logoutBtn: {
    padding: '0.6rem 1.75rem',
    borderRadius: '9999px',
    background: 'rgba(159,64,45,0.07)',
    border: '1px solid rgba(159,64,45,0.18)',
    color: 'var(--secondary)',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'inherit',
  },
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
};

const formatDate = (str) => {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const name      = user?.name     || '—';
  const username  = user?.username || user?.name?.toLowerCase().replace(/\s+/g, '_') || '—';
  const email     = user?.email    || '—';
  const role      = user?.role     || 'Curator Access';
  const joinedAt  = formatDate(user?.created_at  || user?.joined_at);
  const lastLogin = formatDate(user?.last_login_at) || 'Recently';
  const initials  = getInitials(name);

  const handleLogout = () => {
    if (window.confirm(`Sign out of ${name}?`)) {
      dispatch(logout());
    }
  };

  return (
    <div style={m.page}>
      <PageHeader
        title="My Profile"
        subtitle="Your account details and access information"
      />

      {/* Identity card */}
      <div style={m.topCard}>
        <div style={m.banner}>
          <div style={m.bannerPattern} />
        </div>
        <div style={m.identityRow}>
          <div style={m.avatarWrap}>
            <div style={m.avatar}>{initials}</div>
            <div style={m.nameBlock}>
              <p style={m.name}>{name}</p>
              <p style={m.handle}>@{username}</p>
            </div>
          </div>
          <span style={m.roleBadge}>{role}</span>
        </div>
      </div>

      {/* Detail grid */}
      <div style={m.grid}>

        {/* Account info */}
        <div style={m.card}>
          <p style={m.cardTitle}>Account Information</p>
          <div style={m.infoList}>
            <div style={m.infoRow}>
              <span style={m.infoLabel}>Full name</span>
              <span style={m.infoValue}>{name}</span>
            </div>
            <div style={m.infoRow}>
              <span style={m.infoLabel}>Username</span>
              <span style={m.infoValue}>@{username}</span>
            </div>
            <div style={m.infoRowLast}>
              <span style={m.infoLabel}>Email</span>
              <span style={m.infoValue}>{email}</span>
            </div>
          </div>
        </div>

        {/* Access info */}
        <div style={m.card}>
          <p style={m.cardTitle}>Access & Activity</p>
          <div style={m.infoList}>
            <div style={m.infoRow}>
              <span style={m.infoLabel}>Role</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '0.18rem 0.65rem', borderRadius: '9999px',
                fontSize: '0.72rem', fontWeight: 700,
                background: 'rgba(0,78,138,0.08)', color: 'var(--primary)',
                border: '1px solid rgba(0,78,138,0.14)',
              }}>{role}</span>
            </div>
            <div style={m.infoRow}>
              <span style={m.infoLabel}>Member since</span>
              <span style={m.infoValue}>{joinedAt}</span>
            </div>
            <div style={m.infoRowLast}>
              <span style={m.infoLabel}>Last login</span>
              <span style={m.infoValue}>{lastLogin}</span>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div style={m.dangerCard}>
          <div>
            <p style={{ ...m.cardTitle, marginBottom: '0.2rem' }}>Sign Out</p>
            <p style={m.dangerText}>You will be logged out of the admin panel.</p>
          </div>
          <button style={m.logoutBtn} onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
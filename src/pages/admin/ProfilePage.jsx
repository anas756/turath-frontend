import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { logout } from '../../app/services/reduxTollkit/asyncThunks/AuthThunk';
import PageHeader from '../../components/admin/PageHeader';
import { updateUser } from '../../app/services/reduxTollkit/asyncThunks/UserThunk';

const Schema = yup.object().shape({
  name:                  yup.string().required('Full name required').min(3),
  userName:              yup.string().required('Username required').min(3).max(20).matches(/^[a-zA-Z0-9_]+$/),
  email:                 yup.string().required('Email required').email(),
  password:              yup.string().transform(v => v === '' ? undefined : v).notRequired().min(8, 'Min 8 characters'),
  password_confirmation: yup.string().transform(v => v === '' ? undefined : v).notRequired()
                            .oneOf([yup.ref('password'), undefined], 'Passwords must match'),
});

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

// ── Edit modal ────────────────────────────────────────────────────────────────
function EditProfileModal({ user, onClose }) {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      name:     user?.name     || '',
      userName: user?.userName || user?.username || '',
      email:    user?.email    || '',
      password: '',
      password_confirmation: '',
    },
  });
  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = { name: data.name, userName: data.userName, email: data.email };
      if (data.password) {
        payload.password = data.password;
        payload.password_confirmation = data.password_confirmation;
      }
      await dispatch(updateUser({ id: user?.id || user?._id, data: payload })).unwrap();
      onClose();
    } catch (err) {
      alert(err?.message || err || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const ms = {
    overlay:  { position: 'fixed', inset: 0, background: 'rgba(28,28,24,0.35)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal:    { background: 'var(--surface-white)', borderRadius: '1rem', width: '90%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(28,28,24,0.14)' },
    inner:    { padding: 'clamp(1rem, 4vw, 2rem)' },
    header:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
    title:    { fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--on-surface)', margin: 0 },
    subtitle: { color: 'var(--on-surface-muted)', fontSize: '0.85rem', marginTop: '0.25rem' },
    closeBtn: { background: 'var(--surface-low)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    grid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' },
    full:     { gridColumn: '1 / -1' },
    group:    { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    label:    { fontSize: '0.85rem', fontWeight: 500, color: 'var(--on-surface)' },
    optional: { fontWeight: 'normal', fontSize: '0.7rem', color: 'var(--on-surface-muted)' },
    input:    { padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'var(--surface-low)', fontSize: '0.9rem', outline: 'none', width: '100%' },
    error:    { color: 'var(--secondary)', fontSize: '0.7rem', marginTop: '0.25rem' },
    actions:  { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' },
    cancel:   { padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'var(--surface-high)', border: 'none', cursor: 'pointer', color: 'var(--on-surface-muted)', fontFamily: 'inherit' },
    submit:   { padding: '0.5rem 1.5rem', borderRadius: '9999px', background: 'var(--primary-gradient)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  };

  return (
    <div style={ms.overlay} onClick={onClose}>
      <div style={ms.modal} onClick={e => e.stopPropagation()}>
        <div style={ms.inner}>
          <div style={ms.header}>
            <div>
              <h2 style={ms.title}>Edit Profile</h2>
              <p style={ms.subtitle}>Update your account details</p>
            </div>
            <button onClick={onClose} style={ms.closeBtn}>✕</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={ms.grid}>
              <div style={ms.group}>
                <label style={ms.label}>Full Name</label>
                <input {...register('name')} style={ms.input} />
                {errors.name && <span style={ms.error}>{errors.name.message}</span>}
              </div>
              <div style={ms.group}>
                <label style={ms.label}>Username</label>
                <input {...register('userName')} style={ms.input} />
                {errors.userName && <span style={ms.error}>{errors.userName.message}</span>}
              </div>
              <div style={{ ...ms.group, ...ms.full }}>
                <label style={ms.label}>Email Address</label>
                <input type="email" {...register('email')} style={ms.input} />
                {errors.email && <span style={ms.error}>{errors.email.message}</span>}
              </div>
              <div style={ms.group}>
                <label style={ms.label}>New Password <span style={ms.optional}>(optional)</span></label>
                <input type="password" {...register('password')} style={ms.input} />
                {errors.password && <span style={ms.error}>{errors.password.message}</span>}
              </div>
              <div style={ms.group}>
                <label style={ms.label}>Confirm Password</label>
                <input type="password" {...register('password_confirmation')} style={ms.input} />
                {errors.password_confirmation && <span style={ms.error}>{errors.password_confirmation.message}</span>}
              </div>
            </div>
            <div style={ms.actions}>
              <button type="button" onClick={onClose} style={ms.cancel}>Cancel</button>
              <button type="submit" disabled={saving} style={{ ...ms.submit, opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const dispatch  = useDispatch();
  const { user }  = useSelector((state) => state.auth);
  const [showEdit, setShowEdit] = useState(false);

  const name      = user?.name     || '—';
  const username  = user?.userName || user?.username || '—';
  const email     = user?.email    || '—';
  const role      = user?.role     || 'Curator Access';
  const joinedAt  = formatDate(user?.created_at || user?.joined_at);
  const lastLogin = formatDate(user?.last_login_at) || '—';
  const initials  = getInitials(name);

  const handleLogout = () => {
    if (window.confirm(`Sign out of ${name}?`)) dispatch(logout());
  };

  const p = {
    page: {
      width: 'min(100%, 1360px)',
      margin: '0 auto',
      padding: 'clamp(0rem, 2vw, 2rem)',
    },

    // ── Identity card — flat, no banner, no blue ───────────────────────────
    identityCard: {
      background: 'var(--surface-white)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-lift)',
      padding: '1.5rem 1.75rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    leftRow:  { display: 'flex', alignItems: 'center', gap: '1.25rem' },
    avatar: {
      width: '52px', height: '52px', borderRadius: '50%',
      background: 'var(--primary-gradient)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Noto Serif', serif", fontSize: '1.1rem', fontWeight: 600, color: '#fff',
      flexShrink: 0,
    },
    fullName: {
      fontFamily: "'Noto Serif', serif",
      fontSize: '1.1rem', fontWeight: 600,
      color: 'var(--on-surface)', margin: 0,
    },
    handle:   { fontSize: '0.78rem', color: 'var(--on-surface-muted)', marginTop: '0.15rem' },
    editBtn: {
      padding: '0.5rem 1.35rem', borderRadius: '9999px',
      background: 'var(--primary-gradient)', color: '#fff',
      border: 'none', cursor: 'pointer',
      fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: '6px',
    },

    // ── Detail grid ────────────────────────────────────────────────────────
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 430px), 1fr))',
      gap: '1.5rem',
      alignItems: 'stretch',
    },
    card: {
      background: 'var(--surface-white)', borderRadius: '1rem',
      boxShadow: 'var(--shadow-lift)', padding: '1.5rem',
      minWidth: 0,
    },
    secLabel: {
      fontSize: '0.63rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.1em',
      color: 'var(--on-surface-muted)', marginBottom: '1rem',
    },
    list:    { border: '1px solid var(--surface-high)', borderRadius: '0.625rem', overflow: 'hidden' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid var(--surface-low)' },
    rowLast: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem' },
    lbl:     { fontSize: '0.75rem', color: 'var(--on-surface-muted)', fontWeight: 500 },
    val:     { fontSize: '0.82rem', color: 'var(--on-surface)', fontWeight: 600, textAlign: 'right', minWidth: 0, overflowWrap: 'break-word' },
    rolePill: {
      display: 'inline-flex', padding: '0.18rem 0.7rem',
      borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700,
      background: 'rgba(0,78,138,0.08)', color: 'var(--primary)',
      border: '1px solid rgba(0,78,138,0.14)',
    },

    // ── Sign out card ──────────────────────────────────────────────────────
    signoutCard: {
      background: 'var(--surface-white)', borderRadius: '1rem',
      boxShadow: 'var(--shadow-lift)', padding: '1.5rem',
      gridColumn: '1 / -1',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '1rem',
    },
    signoutSub: { fontSize: '0.83rem', color: 'var(--on-surface-muted)', marginTop: '0.2rem' },
    logoutBtn: {
      padding: '0.5rem 1.5rem', borderRadius: '9999px',
      background: 'rgba(159,64,45,0.07)', border: '1px solid rgba(159,64,45,0.18)',
      color: 'var(--secondary)', cursor: 'pointer',
      fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: '6px',
    },
  };

  return (
    <div style={p.page}>
      <PageHeader title="My Profile" subtitle="Your account details and access information" />

      {/* Identity card — flat, no banner */}
      <div style={p.identityCard}>
        <div style={p.leftRow}>
          <div style={p.avatar}>{initials}</div>
          <div>
            <h2 style={p.fullName}>{name}</h2>
            <p style={p.handle}>@{username}</p>
          </div>
        </div>
        <button style={p.editBtn} onClick={() => setShowEdit(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit Profile
        </button>
      </div>

      {/* Detail grid */}
      <div style={p.grid}>

        <div style={p.card}>
          <p style={p.secLabel}>Account Information</p>
          <div style={p.list}>
            <div style={p.row}>
              <span style={p.lbl}>Full name</span>
              <span style={p.val}>{name}</span>
            </div>
            <div style={p.row}>
              <span style={p.lbl}>Username</span>
              <span style={p.val}>@{username}</span>
            </div>
            <div style={p.rowLast}>
              <span style={p.lbl}>Email</span>
              <span style={p.val}>{email}</span>
            </div>
          </div>
        </div>

        <div style={p.card}>
          <p style={p.secLabel}>Access & Activity</p>
          <div style={p.list}>
            <div style={p.row}>
              <span style={p.lbl}>Role</span>
              <span style={p.rolePill}>{role}</span>
            </div>
            <div style={p.row}>
              <span style={p.lbl}>Member since</span>
              <span style={p.val}>{joinedAt}</span>
            </div>
            <div style={p.rowLast}>
              <span style={p.lbl}>Last login</span>
              <span style={p.val}>{lastLogin}</span>
            </div>
          </div>
        </div>

        <div style={p.signoutCard}>
          <div>
            <p style={p.secLabel}>Sign Out</p>
            <p style={p.signoutSub}>You will be logged out of the admin panel.</p>
          </div>
          <button style={p.logoutBtn} onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>

      </div>

      {showEdit && <EditProfileModal user={user} onClose={() => setShowEdit(false)} />}
    </div>
  );
}

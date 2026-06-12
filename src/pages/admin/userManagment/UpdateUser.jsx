// src/pages/admin/userManagement/UpdateUser.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Schema = yup.object().shape({
  name: yup.string().required('Full name required').min(3),
  userName: yup.string().required('Username required').min(3).max(20).matches(/^[a-zA-Z0-9_]+$/),
  email: yup.string().required('Email required').email(),
  password: yup.string().transform(v => v === '' ? undefined : v).notRequired().min(8, 'Min 8 characters'),
  password_confirmation: yup.string().transform(v => v === '' ? undefined : v).notRequired().oneOf([yup.ref('password'), undefined], 'Passwords must match'),
  role: yup.string().required('Role required').oneOf(['user', 'admin']),
});

export default function UpdateUser({ setShowUpdate, user, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(Schema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        userName: user.userName || '',
        email: user.email || '',
        role: user.role?.toLowerCase() || 'user',
        password: '',
        password_confirmation: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (!onUpdate) return;
    setIsUpdating(true);
    try {
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.password_confirmation;
      }
      await onUpdate(user._id || user.id, updateData);
      setShowUpdate(false);
    } catch (err) {
      alert(err.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  // Styles
  const styles = {
    container: { padding: 'clamp(1rem, 4vw, 2rem)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
    title: { fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--on-surface)', margin: 0 },
    subtitle: { color: 'var(--on-surface-muted)', fontSize: '0.85rem', marginTop: '0.25rem' },
    closeBtn: { background: 'var(--surface-low)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' },
    fullWidth: { gridColumn: '1 / -1' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    label: { fontSize: '0.85rem', fontWeight: 500, color: 'var(--on-surface)' },
    optional: { fontWeight: 'normal', fontSize: '0.7rem', color: 'var(--on-surface-muted)' },
    input: { padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'var(--surface-low)', fontSize: '0.9rem', outline: 'none', transition: 'box-shadow 0.2s' },
    error: { color: 'var(--secondary)', fontSize: '0.7rem', marginTop: '0.25rem' },
    radioGroup: { display: 'flex', gap: '1.5rem', marginTop: '0.5rem' },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' },
    cancelBtn: { padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'var(--surface-high)', border: 'none', cursor: 'pointer', color: 'var(--on-surface-muted)' },
    submitBtn: { padding: '0.5rem 1.5rem', borderRadius: '9999px', background: 'var(--primary-gradient)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Edit User Profile</h2>
          <p style={styles.subtitle}>Update settings for @{user?.userName}</p>
        </div>
        <button onClick={() => setShowUpdate(false)} style={styles.closeBtn}>✕</button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input {...register('name')} style={styles.input} />
            {errors.name && <span style={styles.error}>{errors.name.message}</span>}
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input {...register('userName')} style={styles.input} />
            {errors.userName && <span style={styles.error}>{errors.userName.message}</span>}
          </div>
          <div style={{ ...styles.inputGroup, ...styles.fullWidth }}>
            <label style={styles.label}>Email Address</label>
            <input type="email" {...register('email')} style={styles.input} />
            {errors.email && <span style={styles.error}>{errors.email.message}</span>}
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password <span style={styles.optional}>(optional)</span></label>
            <input type="password" {...register('password')} style={styles.input} />
            {errors.password && <span style={styles.error}>{errors.password.message}</span>}
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input type="password" {...register('password_confirmation')} style={styles.input} />
            {errors.password_confirmation && <span style={styles.error}>{errors.password_confirmation.message}</span>}
          </div>
          <div style={{ ...styles.inputGroup, ...styles.fullWidth }}>
            <label style={styles.label}>Account Role</label>
            <div style={styles.radioGroup}>
              <label><input type="radio" value="user" {...register('role')} /> 👤 User</label>
              <label><input type="radio" value="admin" {...register('role')} /> 🛡️ Admin</label>
            </div>
            {errors.role && <span style={styles.error}>{errors.role.message}</span>}
          </div>
        </div>
        <div style={styles.actions}>
          <button type="button" onClick={() => setShowUpdate(false)} style={styles.cancelBtn}>Cancel</button>
          <button type="submit" disabled={isUpdating} style={styles.submitBtn}>
            {isUpdating ? 'Saving...' : 'Update Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

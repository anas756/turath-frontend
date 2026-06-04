// StoreUser.jsx (inline styles version)
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../app/services/reduxTollkit/asyncThunks/UserThunk';
import { clearMessages } from '../../../app/services/reduxTollkit/Slices/MessageSlice';

const Schema = yup.object().shape({
  name: yup.string().required('Full name required').min(3),
  userName: yup.string().required('Username required').min(3).max(20).matches(/^[a-zA-Z0-9_]+$/),
  email: yup.string().required('Email required').email(),
  password: yup.string().required('Password required').min(8),
  password_confirmation: yup.string().required('Confirm password').oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup.string().required('Select role').oneOf(['Admin', 'user', 'admin']),
});

export default function StoreUser({ setShowStore }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: { role: 'user' },
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    dispatch(clearMessages());
    try {
      await dispatch(registerUser(data)).unwrap();
      setShowStore(false);
    } catch (err) {
      alert(err.message || 'Creation failed');
    }
  };

  const modalStyles = {
    container: { padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
    title: { fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--on-surface)', margin: 0 },
    subtitle: { color: 'var(--on-surface-muted)', fontSize: '0.85rem', marginTop: '0.25rem' },
    closeBtn: { background: 'var(--surface-low)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
    fullWidth: { gridColumn: 'span 2' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    label: { fontSize: '0.85rem', fontWeight: 500, color: 'var(--on-surface)' },
    input: { padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'var(--surface-low)', fontSize: '0.9rem', outline: 'none', transition: 'box-shadow 0.2s' },
    error: { color: 'var(--secondary)', fontSize: '0.7rem', marginTop: '0.25rem' },
    radioGroup: { display: 'flex', gap: '1.5rem', marginTop: '0.5rem' },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' },
    cancelBtn: { padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'var(--surface-high)', border: 'none', cursor: 'pointer' },
    submitBtn: { padding: '0.5rem 1.5rem', borderRadius: '9999px', background: 'var(--primary-gradient)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer' },
  };

  return (
    <div style={modalStyles.container}>
      <div style={modalStyles.header}>
        <div>
          <h2 style={modalStyles.title}>Create New User</h2>
          <p style={modalStyles.subtitle}>Add a new member to Turath Digital</p>
        </div>
        <button onClick={() => setShowStore(false)} style={modalStyles.closeBtn}>✕</button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={modalStyles.form}>
        <div style={modalStyles.grid}>
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Full Name</label>
            <input {...register('name')} style={modalStyles.input} />
            {errors.name && <span style={modalStyles.error}>{errors.name.message}</span>}
          </div>
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Username</label>
            <input {...register('userName')} style={modalStyles.input} />
            {errors.userName && <span style={modalStyles.error}>{errors.userName.message}</span>}
          </div>
          <div style={{ ...modalStyles.inputGroup, ...modalStyles.fullWidth }}>
            <label style={modalStyles.label}>Email Address</label>
            <input type="email" {...register('email')} style={modalStyles.input} />
            {errors.email && <span style={modalStyles.error}>{errors.email.message}</span>}
          </div>
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Password</label>
            <input type="password" {...register('password')} style={modalStyles.input} />
            {errors.password && <span style={modalStyles.error}>{errors.password.message}</span>}
          </div>
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Confirm Password</label>
            <input type="password" {...register('password_confirmation')} style={modalStyles.input} />
            {errors.password_confirmation && <span style={modalStyles.error}>{errors.password_confirmation.message}</span>}
          </div>
          <div style={{ ...modalStyles.inputGroup, ...modalStyles.fullWidth }}>
            <label style={modalStyles.label}>Account Role</label>
            <div style={modalStyles.radioGroup}>
              <label><input type="radio" value="user" {...register('role')} /> User</label>
              <label><input type="radio" value="Admin" {...register('role')} /> Admin</label>
            </div>
            {errors.role && <span style={modalStyles.error}>{errors.role.message}</span>}
          </div>
        </div>
        <div style={modalStyles.actions}>
          <button type="button" onClick={() => setShowStore(false)} style={modalStyles.cancelBtn}>Cancel</button>
          <button type="submit" disabled={isSubmitting} style={modalStyles.submitBtn}>
            {isSubmitting ? 'Creating...' : 'Save User'}
          </button>
        </div>
      </form>
    </div>
  );
}
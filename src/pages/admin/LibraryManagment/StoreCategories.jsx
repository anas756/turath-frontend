import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Category name is required').min(3, 'Too short!'),
  slug: yup
    .string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/, 'Must be lowercase and dash-separated'),
  description: yup.string().max(255, 'Description too long'),
});

export default function StoreCategories({ setShowStore }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log('Valid data:', data);
    setShowStore(false);
  };

  return (
    <div style={m.container}>
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Add New Category</h2>
          <p style={m.subtitle}>Create a new category for your documents</p>
        </div>
        <button onClick={() => setShowStore(false)} style={m.closeBtn}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={m.form}>
        <div style={m.grid}>
          <div style={m.inputGroup}>
            <label style={m.label}>Category Name</label>
            <input
              {...register('name')}
              style={m.input}
              placeholder="e.g. History"
            />
            {errors.name && <span style={m.error}>{errors.name.message}</span>}
          </div>

          <div style={m.inputGroup}>
            <label style={m.label}>Slug</label>
            <input
              {...register('slug')}
              style={m.input}
              placeholder="e.g. history-docs"
            />
            {errors.slug && <span style={m.error}>{errors.slug.message}</span>}
          </div>
        </div>

        <div style={m.inputGroup}>
          <label style={m.label}>Description</label>
          <textarea
            {...register('description')}
            style={{ ...m.input, height: '100px' }}
          />
          {errors.description && (
            <span style={m.error}>{errors.description.message}</span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1rem',
          }}
        >
          <button type="submit" style={m.submitBtn}>
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
}

// الـ Styles اللي عطيتيني
const m = {
  container: { padding: '2rem' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.75rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--on-surface)',
    margin: 0,
  },
  subtitle: {
    color: 'var(--on-surface-muted)',
    fontSize: '0.85rem',
    marginTop: '0.25rem',
  },
  closeBtn: {
    background: 'var(--surface-low)',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
  },
  input: {
    padding: '0.6rem 0.85rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: 'var(--surface-low)',
    width: '100%',
  },
  error: { color: 'var(--secondary)', fontSize: '0.72rem' },
  submitBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: '9999px',
    background: 'var(--primary-gradient)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

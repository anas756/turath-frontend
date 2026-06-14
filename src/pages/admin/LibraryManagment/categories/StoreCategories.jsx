import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { createCategory } from '../../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';
import RichDescriptionEditor from '../../../../components/admin/RichDescriptionEditor';

const schema = yup.object().shape({
  name: yup.string().required('Category name is required').min(3, 'Too short!'),
  description: yup.string().max(6000, 'Description too long'),
  banner: yup.mixed().optional(),
});

export default function StoreCategories({ setShowStore }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { description: '' },
  });
  const dispatch = useDispatch();
  const descriptionValue = watch('description') || '';

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);

    const banner = data.banner?.[0];
    if (banner instanceof File) {
      formData.append('banner', banner);
    }

    try {
      await dispatch(createCategory(formData)).unwrap();
      setShowStore(false);
    } catch (err) {
      alert(err?.message || 'Failed to create category');
    }
  };

  return (
    <div style={m.container}>
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Add New Category</h2>
          <p style={m.subtitle}>
            Create a category and Turath will fetch matching books automatically.
          </p>
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
            <span style={m.hint}>
              We will search this name across Gutendex, Google Books, and Internet Archive.
            </span>
            {errors.name && <span style={m.error}>{errors.name.message}</span>}
          </div>
        </div>

        <div style={m.inputGroup}>
          <label style={m.label}>Description</label>
          <RichDescriptionEditor
            value={descriptionValue}
            onChange={(html) => setValue('description', html, { shouldDirty: true, shouldValidate: true })}
            placeholder="Design the category description with headings, lists, links, or custom HTML."
          />
          <span style={m.hint}>Use the toolbar or switch to HTML for custom designed text.</span>
          {errors.description && (
            <span style={m.error}>{errors.description.message}</span>
          )}
        </div>

        <div style={m.inputGroup}>
          <label style={m.label}>Category Image</label>
          <input
            type="file"
            accept="image/*"
            {...register('banner')}
            style={m.input}
          />
          <span style={m.hint}>Shown on guest and user collection cards.</span>
          {errors.banner && (
            <span style={m.error}>{errors.banner.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...m.submitBtn,
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Starting import...' : 'Save Category & Fetch Books'}
        </button>
      </form>
    </div>
  );
}

// الـ Styles اللي عطيتيني
const m = {
  container: { padding: 'clamp(1rem, 4vw, 2rem)' },
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' },
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
  hint: {
    fontSize: '0.7rem',
    color: 'var(--on-surface-muted)',
    marginTop: '0.15rem',
  },
  submitBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: '9999px',
    background: 'var(--primary-gradient)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

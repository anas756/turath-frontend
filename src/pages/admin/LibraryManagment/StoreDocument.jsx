import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createDoc } from '../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';

const Schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3),
  authors: yup.string().required('Authors are required'),
  categorie_id: yup.string().required('Category is required'),
  source: yup.string().optional(),
  tags: yup.string().optional(),
  description: yup.string().optional(),
  file: yup.mixed().required('Document file is required'),
  cover: yup.mixed().optional(),
});

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
  optionalLabel: {
    fontWeight: 400,
    textTransform: 'none',
    fontSize: '0.72rem',
    color: 'var(--on-surface-muted)',
  },
  input: {
    padding: '0.6rem 0.85rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: 'var(--surface-low)',
    width: '100%',
  },
  hint: {
    fontSize: '0.7rem',
    color: 'var(--on-surface-muted)',
    marginTop: '0.15rem',
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

export default function StoreDocument({ setShowStore }) {
  const dispatch = useDispatch();
  const { categories = [] } = useSelector((state) => state.library || {});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('categorie_id', data.categorie_id);
    formData.append('description', data.description || '');
    formData.append('source', data.source || '');

    // Ensure authors is sent as an array
    formData.append('authors', data.authors);

    if (data.tags) {
      data.tags
        .split(',')
        .forEach((tag) => formData.append('tags[]', tag.trim()));
    }


    data.authors.split(',').forEach((author) => {
      formData.append('authors[]', author.trim());
    });

    // Ensure file is correctly accessed
    if (data.file && data.file[0]) {
      formData.append('file_path', data.file[0]);
    }


    if (data.cover?.[0]) {
      formData.append('cover', data.cover[0]);
    }

    try {
      await dispatch(createDoc(formData)).unwrap();
      setShowStore(false);
    } catch (err) {
      console.error('Submission Error:', err);
      alert(err?.data?.message || 'Failed to create document');
    }
  };

  return (
    <div style={m.container}>
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Add New Document</h2>
          <p style={m.subtitle}>
            Archive a new heritage document to the library
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowStore(false)}
          style={m.closeBtn}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={m.form}>
        <div style={m.grid}>
          {/* Title - full width */}
          <div style={{ gridColumn: 'span 2', ...m.inputGroup }}>
            <label style={m.label}>Document Title</label>
            <input {...register('title')} style={m.input} />
            {errors.title && (
              <span style={m.error}>{errors.title.message}</span>
            )}
          </div>

          {/* Authors */}
          <div style={m.inputGroup}>
            <label style={m.label}>Authors</label>
            <input
              {...register('authors')}
              style={m.input}
              placeholder="e.g. Ibn Battuta, Al-Idrisi"
            />
            <span style={m.hint}>Separate multiple authors with a comma</span>
            {errors.authors && (
              <span style={m.error}>{errors.authors.message}</span>
            )}
          </div>

          {/* Category */}
          <div style={m.inputGroup}>
            <label style={m.label}>Category</label>
            <select {...register('categorie_id')} style={m.input}>
              <option value="">Select category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categorie_id && (
              <span style={m.error}>{errors.categorie_id.message}</span>
            )}
          </div>

          {/* Document File */}
          <div style={m.inputGroup}>
            <label style={m.label}>Document File (PDF)</label>
            <input
              type="file"
              {...register('file')}
              accept="application/pdf"
              style={m.input}
            />
            {errors.file && <span style={m.error}>{errors.file.message}</span>}
          </div>

          {/* Cover Image */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Cover Image <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input
              type="file"
              {...register('cover')}
              accept="image/*"
              style={m.input}
            />
          </div>

          {/* Source */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Source <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input
              {...register('source')}
              style={m.input}
              placeholder="e.g. National Library"
            />
          </div>

          {/* Tags */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Tags <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input
              {...register('tags')}
              style={m.input}
              placeholder="e.g. history, Morocco"
            />
            <span style={m.hint}>Comma-separated</span>
          </div>

          {/* Description - full width */}
          <div style={{ gridColumn: 'span 2', ...m.inputGroup }}>
            <label style={m.label}>
              Description <span style={m.optionalLabel}>(optional)</span>
            </label>
            <textarea
              {...register('description')}
              style={{ ...m.input, minHeight: '80px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...m.submitBtn,
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </form>
    </div>
  );
}

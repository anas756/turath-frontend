import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { createMedia } from './../../../app/services/reduxTollkit/asyncThunks/MediaThunk';

const Schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Min 3 characters'),
  type: yup
    .string()
    .required('Type is required')
    .oneOf(['image', 'video', 'audio', 'document']),
  status: yup.string().optional(),
  curator: yup.string().optional(),
  file_path: yup.mixed().required('Media file is required'),
});

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
  preview: { marginTop: '0.5rem', maxWidth: '100px', borderRadius: '0.5rem' },
};

export default function StoreMedia({ setShowStore }) {
  const [filePreview, setFilePreview] = useState(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: { status: 'active' },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
      setValue('file_path', e.target.files);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('status', data.status || 'active');
    if (data.curator) formData.append('curator', data.curator);

    const file = data.file_path?.[0];
    if (file instanceof File) {
      formData.append('file_path', file);
    }

    try {
      await dispatch(createMedia(formData)).unwrap();
      setShowStore(false);
    } catch (err) {
      console.error('Submission Error:', err);
    }
  };

  return (
    <div style={m.container}>
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Add New Media</h2>
          <p style={m.subtitle}>Upload a new media asset to the library</p>
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
          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>Media Title</label>
            <input
              {...register('title')}
              style={m.input}
              placeholder="e.g. Ancient Map"
            />
            {errors.title && (
              <span style={m.error}>{errors.title.message}</span>
            )}
          </div>

          <div style={m.inputGroup}>
            <label style={m.label}>Type</label>
            <select {...register('type')} style={m.input}>
              <option value="">Select type…</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Document</option>
            </select>
            {errors.type && <span style={m.error}>{errors.type.message}</span>}
          </div>

          <div style={m.inputGroup}>
            <label style={m.label}>Status</label>
            <select {...register('status')} style={m.input}>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="processing">Processing</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>Media File</label>
            <input type="file" onChange={handleFileChange} style={m.input} />
            {filePreview && (
              <img src={filePreview} alt="Preview" style={m.preview} />
            )}
            <span style={m.hint}>Image, video, audio, or PDF — max 100MB</span>
            {errors.file_path && (
              <span style={m.error}>{errors.file_path.message}</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ ...m.submitBtn, opacity: isSubmitting ? 0.6 : 1 }}
          >
            {isSubmitting ? 'Saving...' : 'Save Media'}
          </button>
        </div>
      </form>
    </div>
  );
}

// StoreDocument.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createDoc } from '../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';

const Schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3),
  author: yup.string().required('Author is required'),
  language: yup.string().required('Language is required'),
  category_id: yup.string().required('Category is required'),
  status: yup.string().required('Status is required').oneOf(['Draft', 'Published', 'Under Review']),
  description: yup.string().optional(),
});

const m = {
  container:  { padding: '2rem' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' },
  title:      { fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--on-surface)', margin: 0 },
  subtitle:   { color: 'var(--on-surface-muted)', fontSize: '0.85rem', marginTop: '0.25rem' },
  closeBtn:   { background: 'var(--surface-low)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  form:       { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  grid:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  fullWidth:  { gridColumn: 'span 2' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label:      { fontSize: '0.8rem', fontWeight: 600, color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input:      { padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'var(--surface-low)', fontSize: '0.9rem', outline: 'none', color: 'var(--on-surface)', width: '100%', boxSizing: 'border-box' },
  select:     { padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'var(--surface-low)', fontSize: '0.9rem', outline: 'none', color: 'var(--on-surface)', width: '100%', cursor: 'pointer', boxSizing: 'border-box' },
  textarea:   { padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'var(--surface-low)', fontSize: '0.9rem', outline: 'none', color: 'var(--on-surface)', width: '100%', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box', fontFamily: 'inherit' },
  error:      { color: 'var(--secondary)', fontSize: '0.72rem' },
  divider:    { borderTop: '1px solid var(--surface-low)', margin: '0.5rem 0' },
  actions:    { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' },
  cancelBtn:  { padding: '0.55rem 1.25rem', borderRadius: '9999px', background: 'var(--surface-high)', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', color: 'var(--on-surface)' },
  submitBtn:  { padding: '0.55rem 1.5rem', borderRadius: '9999px', background: 'var(--primary-gradient)', border: 'none', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' },
};

export default function StoreDocument({ setShowStore }) {
  const dispatch = useDispatch();
  const { categories = [] } = useSelector((state) => state.library || {});

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: { status: 'Draft' },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(createDoc(data)).unwrap();
      setShowStore(false);
    } catch (err) {
      alert(err?.message || err || 'Failed to create document');
    }
  };

  return (
    <div style={m.container}>
      {/* Header */}
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Add New Document</h2>
          <p style={m.subtitle}>Archive a new heritage document to the library</p>
        </div>
        <button onClick={() => setShowStore(false)} style={m.closeBtn}>✕</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={m.form}>
        <div style={m.grid}>

          {/* Title – full width */}
          <div style={{ ...m.inputGroup, ...m.fullWidth }}>
            <label style={m.label}>Document Title</label>
            <input {...register('title')} placeholder="e.g. Al-Qarawiyyin Manuscript 042" style={m.input} />
            {errors.title && <span style={m.error}>{errors.title.message}</span>}
          </div>

          {/* Author */}
          <div style={m.inputGroup}>
            <label style={m.label}>Author</label>
            <input {...register('author')} placeholder="e.g. Ibn Rushd" style={m.input} />
            {errors.author && <span style={m.error}>{errors.author.message}</span>}
          </div>

          {/* Language */}
          <div style={m.inputGroup}>
            <label style={m.label}>Language</label>
            <select {...register('language')} style={m.select}>
              <option value="">Select language…</option>
              <option value="Arabic">Arabic</option>
              <option value="French">French</option>
              <option value="Amazigh">Amazigh</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
            </select>
            {errors.language && <span style={m.error}>{errors.language.message}</span>}
          </div>

          {/* Category */}
          <div style={m.inputGroup}>
            <label style={m.label}>Category</label>
            <select {...register('category_id')} style={m.select}>
              <option value="">Select category…</option>
              {categories.map((cat) => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <span style={m.error}>{errors.category_id.message}</span>}
          </div>

          {/* Status */}
          <div style={m.inputGroup}>
            <label style={m.label}>Status</label>
            <select {...register('status')} style={m.select}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Under Review">Under Review</option>
            </select>
            {errors.status && <span style={m.error}>{errors.status.message}</span>}
          </div>

          {/* Description – full width */}
          <div style={{ ...m.inputGroup, ...m.fullWidth }}>
            <label style={m.label}>Description <span style={{ fontWeight: 400, textTransform: 'none', opacity: 0.6 }}>(optional)</span></label>
            <textarea {...register('description')} placeholder="Brief description of the document's content and historical significance…" style={m.textarea} />
          </div>
        </div>

        <div style={m.divider} />

        <div style={m.actions}>
          <button type="button" onClick={() => setShowStore(false)} style={m.cancelBtn}>Cancel</button>
          <button type="submit" disabled={isSubmitting} style={{ ...m.submitBtn, opacity: isSubmitting ? 0.7 : 1 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {isSubmitting ? 'Saving…' : 'Save Document'}
          </button>
        </div>
      </form>
    </div>
  );
}
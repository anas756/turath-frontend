import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateDoc } from '../../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';
import RichDescriptionEditor from '../../../../components/admin/RichDescriptionEditor';

const Schema = yup.object().shape({
  title: yup.string().min(3).optional(),
  description: yup.string().optional(),
  authors: yup.string().optional(),
  categorie_id: yup.string().optional(),
  tags: yup.string().optional(),
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
};

export default function UpdateDocument({ document, setShowUpdate }) {
  const dispatch = useDispatch();
  const { categories = [] } = useSelector((state) => state.library || {});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      title: document?.title || '',
      description: document?.description || '',
      authors: document?.authors?.join(', ') || '',
      categorie_id: document?.categorie_id || '',
      tags: document?.tags?.join(', ') || '',
    },
  });
  const descriptionValue = watch('description') || '';

  const onSubmit = async (data) => {
    const payload = {};

    if (data.title) payload.title = data.title;
    if ((data.description || '') !== (document?.description || '')) {
      payload.description = data.description || '';
    }
    if (data.categorie_id) payload.categorie_id = data.categorie_id;

    if (data.authors) {
      payload.authors = data.authors.split(',').map((a) => a.trim());
    }

    if (data.tags) {
      payload.tags = data.tags.split(',').map((t) => t.trim());
    }

    try {
      await dispatch(updateDoc({ id: document.id, data: payload })).unwrap();
      setShowUpdate(false);
    } catch (err) {
      console.error('Update Error:', err);
      alert(err?.data?.message || 'Failed to update document');
    }
  };

  return (
    <div style={m.container}>
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Update Document</h2>
          <p style={m.subtitle}>Edit the details of this heritage document</p>
        </div>
        <button
          type="button"
          onClick={() => setShowUpdate(false)}
          style={m.closeBtn}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={m.form}>
        <div style={m.grid}>
          {/* Title - full width */}
          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>
              Document Title <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input {...register('title')} style={m.input} />
            {errors.title && (
              <span style={m.error}>{errors.title.message}</span>
            )}
          </div>

          {/* Authors */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Authors <span style={m.optionalLabel}>(optional)</span>
            </label>
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
            <label style={m.label}>
              Category <span style={m.optionalLabel}>(optional)</span>
            </label>
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
          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>
              Description <span style={m.optionalLabel}>(optional)</span>
            </label>
            <RichDescriptionEditor
              value={descriptionValue}
              onChange={(html) => setValue('description', html, { shouldDirty: true, shouldValidate: true })}
              placeholder="Design the document description with headings, lists, links, or custom HTML."
            />
            <span style={m.hint}>Use the toolbar or switch to HTML for custom designed text.</span>
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { updateMediaTunk as updateMedia } from '../../../app/services/reduxTollkit/asyncThunks/MediaThunk';


const Schema = yup.object().shape({
  title:       yup.string().min(3).optional(),
  description: yup.string().max(6000, 'Description is too long').optional(),
  tags:        yup.string().optional(),
  type:        yup.string().oneOf(['', 'image', 'video', 'audio']).optional(),
  format:      yup.string().optional(),
  resolution:  yup.string().optional(),
});

const mediaTypes = ['image', 'video', 'audio'];

const m = {
  container: { padding: 'clamp(1rem, 4vw, 2rem)' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.75rem',
  },
  title:    { fontSize: '1.5rem', fontWeight: 600, color: 'var(--on-surface)', margin: 0 },
  subtitle: { color: 'var(--on-surface-muted)', fontSize: '0.85rem', marginTop: '0.25rem' },
  closeBtn: {
    background: 'var(--surface-low)', border: 'none',
    width: '32px', height: '32px', borderRadius: '50%',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  form:       { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: {
    fontSize: '0.8rem', fontWeight: 600,
    color: 'var(--on-surface)', textTransform: 'uppercase',
  },
  optionalLabel: {
    fontWeight: 400, textTransform: 'none',
    fontSize: '0.72rem', color: 'var(--on-surface-muted)',
  },
  input: {
    padding: '0.6rem 0.85rem', borderRadius: '0.5rem',
    border: 'none', backgroundColor: 'var(--surface-low)', width: '100%',
    fontSize: '0.875rem', fontFamily: 'inherit',
  },
  textarea: {
    minHeight: '130px',
    resize: 'vertical',
    lineHeight: 1.6,
  },
  hint:  { fontSize: '0.7rem', color: 'var(--on-surface-muted)', marginTop: '0.15rem' },
  error: { color: 'var(--secondary)', fontSize: '0.72rem' },
  footer: { display: 'flex', justifyContent: 'flex-end' },
  submitBtn: {
    padding: '0.6rem 1.5rem', borderRadius: '9999px',
    background: 'var(--primary-gradient)', color: 'white',
    border: 'none', cursor: 'pointer',
    fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
  },
};

export default function UpdateMedia({ media, setShowUpdate }) {
  const dispatch = useDispatch();
  const currentType = media?.type?.toString().toLowerCase() || '';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      title:       media?.title       || '',
      description: media?.description || '',
      tags:        Array.isArray(media?.tags) ? media.tags.join(', ') : (media?.tags || ''),
      type:        mediaTypes.includes(currentType) ? currentType : '',
      format:      media?.format      || '',
      resolution:  media?.resolution  || '',
    },
  });

  const onSubmit = async (data) => {
    const id = media?._id || media?.id;
    const payload = {};
    if (data.title)       payload.title       = data.title;
    if (data.description) payload.description = data.description;
    if (data.type)        payload.type        = data.type;
    if (data.format)      payload.format      = data.format;
    if (data.resolution)  payload.resolution  = data.resolution;
    if (data.tags)        payload.tags        = data.tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      await dispatch(updateMedia({ id, data: payload })).unwrap();
      setShowUpdate(false);
    } catch (err) {
      alert(err?.data?.message || 'Failed to update media asset');
    }
  };

  return (
    <div style={m.container}>
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Update Media</h2>
          <p style={m.subtitle}>Edit the details of this heritage asset</p>
        </div>
        <button type="button" onClick={() => setShowUpdate(false)} style={m.closeBtn}>✕</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={m.form}>
        <div style={m.grid}>

          {/* Title — full width */}
          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>
              Title <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input {...register('title')} style={m.input} />
            {errors.title && <span style={m.error}>{errors.title.message}</span>}
          </div>

          {/* Type */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Type <span style={m.optionalLabel}>(optional)</span>
            </label>
            <select {...register('type')} style={m.input}>
              <option value="">Select type…</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
            {errors.type && <span style={m.error}>{errors.type.message}</span>}
          </div>

          {/* Format */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Format <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input {...register('format')} style={m.input} placeholder="e.g. jpg, mp3, mp4" />
            {errors.format && <span style={m.error}>{errors.format.message}</span>}
          </div>

          {/* Resolution */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Resolution <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input {...register('resolution')} style={m.input} placeholder="e.g. 1920×1080" />
            {errors.resolution && <span style={m.error}>{errors.resolution.message}</span>}
          </div>

          {/* Tags */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Tags <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input {...register('tags')} style={m.input} placeholder="e.g. heritage, Fes, 1920s" />
            <span style={m.hint}>Comma-separated</span>
          </div>

          {/* Description — full width */}
          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>
              Description HTML <span style={m.optionalLabel}>(optional)</span>
            </label>
            <textarea
              {...register('description')}
              style={{ ...m.input, ...m.textarea }}
              placeholder="<h3>About this item</h3><p>Add a rich description with <strong>important details</strong>.</p>"
            />
            <span style={m.hint}>Allowed: headings, paragraphs, bold, italic, lists, and links.</span>
            {errors.description && <span style={m.error}>{errors.description.message}</span>}
          </div>

        </div>

        <div style={m.footer}>
          <button type="submit" disabled={isSubmitting} style={{ ...m.submitBtn, opacity: isSubmitting ? 0.6 : 1 }}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

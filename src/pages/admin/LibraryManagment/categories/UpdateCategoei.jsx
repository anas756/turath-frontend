import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { updateCategory } from '../../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';
import RichDescriptionEditor from '../../../../components/admin/RichDescriptionEditor';

const Schema = yup.object().shape({
  name: yup.string().max(255).optional(),
  description: yup.string().max(6000).optional(),
  icon: yup.string().max(255).optional(),
  banner: yup.mixed().optional(),
});

const assetBaseUrl = (
  import.meta.env.VITE_BACK_END_URL_IMAGE ||
  import.meta.env.VITE_BACK_END_URL ||
  ''
)
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

function resolveAssetUrl(path) {
  const value = path?.toString().trim();
  if (!value || value === 'null') return null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  const cleanPath = value.replace(/^\/+/, '');
  const publicPath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
  return `${assetBaseUrl}/${publicPath}`;
}

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
  preview: {
    width: 'min(100%, 180px)',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    marginTop: '0.5rem',
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

export default function UpdateCategorie({ categorie, setShowUpdate }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      name: categorie?.name || '',
      description: categorie?.description || '',
      icon: categorie?.icon || '',
    },
  });
  const descriptionValue = watch('description') || '';

  const onSubmit = async (data) => {
    const payload = new FormData();
    payload.append('_method', 'PUT');

    if (data.name && data.name !== categorie?.name) payload.append('name', data.name);
    if ((data.description || '') !== (categorie?.description || '')) {
      payload.append('description', data.description || '');
    }
    if (data.icon && data.icon !== categorie?.icon) payload.append('icon', data.icon);

    const banner = data.banner?.[0];
    if (banner instanceof File) {
      payload.append('banner', banner);
    }

    try {
      await dispatch(
        updateCategory({ id: categorie.id, data: payload })
      ).unwrap();
      setShowUpdate(false);
    } catch (err) {
      console.error('Update Error:', err);
      alert(err?.data?.message || 'Failed to update category');
    }
  };

  return (
    <div style={m.container}>
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Update Category</h2>
          <p style={m.subtitle}>Edit the details of this category</p>
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
          {/* Name - full width */}
          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>
              Name <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input
              {...register('name')}
              style={m.input}
              placeholder="e.g. History"
            />
            {errors.name && <span style={m.error}>{errors.name.message}</span>}
          </div>

          {/* Icon */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Icon <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input
              {...register('icon')}
              style={m.input}
              placeholder="e.g. icon-history"
            />
            <span style={m.hint}>Icon class or URL</span>
            {errors.icon && <span style={m.error}>{errors.icon.message}</span>}
          </div>

          {/* Banner */}
          <div style={m.inputGroup}>
            <label style={m.label}>
              Category Image <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('banner')}
              style={m.input}
            />
            <span style={m.hint}>Shown on guest and user collection cards.</span>
            {resolveAssetUrl(categorie?.banner) && (
              <img
                src={resolveAssetUrl(categorie.banner)}
                alt={`${categorie.name || 'Category'} current banner`}
                style={m.preview}
              />
            )}
            {errors.banner && (
              <span style={m.error}>{errors.banner.message}</span>
            )}
          </div>

          {/* Description - full width */}
          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>
              Description <span style={m.optionalLabel}>(optional)</span>
            </label>
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

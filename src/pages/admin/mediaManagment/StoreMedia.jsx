import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { createMedia } from './../../../app/services/reduxTollkit/asyncThunks/MediaThunk';
import RichDescriptionEditor from '../../../components/admin/RichDescriptionEditor';

const MAX_MEDIA_FILE_SIZE = 100 * 1024 * 1024;

const isAllowedMediaFile = (file) =>
  file instanceof File && (file.type.startsWith('image/') || file.type.startsWith('video/'));

const Schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Min 3 characters'),
  type: yup.string().required('Type is required').oneOf(['image', 'video']),
  description: yup.string().max(6000, 'Description is too long').optional(),
  status: yup.string().optional(),
  curator: yup.string().optional(),
  tags: yup.string().optional(),
  files: yup
    .mixed()
    .test('required', 'At least one media file is required', (value) => value?.length > 0)
    .test('fileType', 'Only image and video files are allowed', (value) =>
      !value?.length || Array.from(value).every(isAllowedMediaFile)
    )
    .test('fileSize', 'Each media file must be 100MB or smaller', (value) =>
      !value?.length || Array.from(value).every((file) => file.size <= MAX_MEDIA_FILE_SIZE)
    ),
});

const m = {
  container: { padding: 'clamp(1rem, 4vw, 2rem)' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.75rem',
  },
  title: { fontSize: '1.5rem', fontWeight: 600, color: 'var(--on-surface)', margin: 0 },
  subtitle: { color: 'var(--on-surface-muted)', fontSize: '0.85rem', marginTop: '0.25rem' },
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: '1.25rem',
  },
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
  hint: { fontSize: '0.7rem', color: 'var(--on-surface-muted)', marginTop: '0.15rem' },
  error: { color: 'var(--secondary)', fontSize: '0.72rem' },
  submitBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: '9999px',
    background: 'var(--primary-gradient)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  fileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  fileCard: {
    border: '1px solid var(--surface-high)',
    borderRadius: '0.75rem',
    padding: '0.65rem',
    background: 'var(--surface-white)',
  },
  preview: {
    width: '100%',
    height: '78px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    background: 'var(--surface-low)',
    marginBottom: '0.45rem',
  },
  fileName: {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--on-surface)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileMeta: { display: 'block', fontSize: '0.66rem', color: 'var(--on-surface-muted)', marginTop: '0.15rem' },
};

function formatFileSize(bytes) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}

export default function StoreMedia({ setShowStore }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: { status: 'active', description: '', tags: '' },
  });
  const descriptionValue = useWatch({ control, name: 'description' }) || '';

  useEffect(() => () => {
    selectedFiles.forEach((file) => {
      if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
    });
  }, [selectedFiles]);

  const handleFileChange = (event) => {
    selectedFiles.forEach((file) => {
      if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
    });

    const files = Array.from(event.target.files || []);
    const previews = files.map((file) => ({
      file,
      isImage: file.type.startsWith('image/'),
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedFiles(previews);
    setValue('files', files, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const files = Array.from(data.files || []);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('status', data.status || 'active');
    if (data.description) formData.append('description', data.description);
    if (data.curator) formData.append('curator', data.curator);
    if (data.tags) {
      data.tags.split(',').map((tag) => tag.trim()).filter(Boolean).forEach((tag) => {
        formData.append('tags[]', tag);
      });
    }
    files.forEach((file) => formData.append('files[]', file));

    try {
      await dispatch(createMedia(formData)).unwrap();
      setShowStore(false);
    } catch (err) {
      alert(err?.data?.message || err?.message || 'Failed to save media');
    }
  };

  return (
    <div style={m.container}>
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Add New Media</h2>
          <p style={m.subtitle}>Upload one or more files for a media story</p>
        </div>
        <button type="button" onClick={() => setShowStore(false)} style={m.closeBtn}>
          x
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={m.form}>
        <div style={m.grid}>
          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>Media Title</label>
            <input {...register('title')} style={m.input} placeholder="e.g. Ancient Map" />
            {errors.title && <span style={m.error}>{errors.title.message}</span>}
          </div>

          <div style={m.inputGroup}>
            <label style={m.label}>Type</label>
            <select {...register('type')} style={m.input}>
              <option value="">Select type...</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
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

          <div style={m.inputGroup}>
            <label style={m.label}>
              Curator <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input {...register('curator')} style={m.input} placeholder="Defaults to current admin" />
          </div>

          <div style={m.inputGroup}>
            <label style={m.label}>
              Tags <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input {...register('tags')} style={m.input} placeholder="e.g. heritage, Fes, 1920s" />
            <span style={m.hint}>Comma-separated</span>
          </div>

          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>
              Description <span style={m.optionalLabel}>(optional)</span>
            </label>
            <RichDescriptionEditor
              value={descriptionValue}
              onChange={(html) => setValue('description', html, { shouldDirty: true, shouldValidate: true })}
              placeholder="Design the media description with headings, bold text, lists, links, or custom HTML."
            />
            <span style={m.hint}>Use the toolbar or switch to HTML for custom designed text.</span>
            {errors.description && <span style={m.error}>{errors.description.message}</span>}
          </div>

          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>Media Files</label>
            <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} style={m.input} />
            <span style={m.hint}>Images or videos only. Each file can be up to 100MB.</span>
            {errors.files && <span style={m.error}>{errors.files.message}</span>}
            {selectedFiles.length > 0 && (
              <div style={m.fileGrid}>
                {selectedFiles.map(({ file, isImage, previewUrl }) => (
                  <div style={m.fileCard} key={`${file.name}-${file.lastModified}`}>
                    {isImage ? (
                      <img src={previewUrl} alt="" style={m.preview} />
                    ) : (
                      <video src={previewUrl} muted playsInline preload="metadata" style={m.preview} />
                    )}
                    <span style={m.fileName}>{file.name}</span>
                    <span style={m.fileMeta}>{file.type || 'Media'} - {formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
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

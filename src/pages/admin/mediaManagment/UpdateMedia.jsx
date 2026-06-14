import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { updateMediaTunk as updateMedia } from '../../../app/services/reduxTollkit/asyncThunks/MediaThunk';
import RichDescriptionEditor from '../../../components/admin/RichDescriptionEditor';
import { getMediaFiles } from '../../../utils/userResources';

const MAX_MEDIA_FILE_SIZE = 100 * 1024 * 1024;

const isAllowedMediaFile = (file) =>
  file instanceof File && (file.type.startsWith('image/') || file.type.startsWith('video/'));

const Schema = yup.object().shape({
  title: yup.string().min(3).optional(),
  description: yup.string().max(6000, 'Description is too long').optional(),
  tags: yup.string().optional(),
  type: yup.string().oneOf(['', 'image', 'video']).optional(),
  files: yup
    .mixed()
    .test('fileType', 'Only image and video files are allowed', (value) =>
      !value?.length || Array.from(value).every(isAllowedMediaFile)
    )
    .test('fileSize', 'Each media file must be 100MB or smaller', (value) =>
      !value?.length || Array.from(value).every((file) => file.size <= MAX_MEDIA_FILE_SIZE)
    ),
});

const mediaTypes = ['image', 'video'];

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
    fontSize: '0.875rem',
    fontFamily: 'inherit',
  },
  hint: { fontSize: '0.7rem', color: 'var(--on-surface-muted)', marginTop: '0.15rem' },
  error: { color: 'var(--secondary)', fontSize: '0.72rem' },
  footer: { display: 'flex', justifyContent: 'flex-end' },
  submitBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: '9999px',
    background: 'var(--primary-gradient)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    fontFamily: 'inherit',
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
  fileCardRemoved: {
    opacity: 0.45,
    background: 'var(--surface-low)',
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
  fileBtn: {
    marginTop: '0.45rem',
    width: '100%',
    border: 'none',
    borderRadius: '999px',
    padding: '0.35rem 0.55rem',
    fontSize: '0.72rem',
    cursor: 'pointer',
  },
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

function isVideo(file) {
  return file?.type?.toString().toLowerCase() === 'video' || file?.mime_type?.startsWith('video/');
}

export default function UpdateMedia({ media, setShowUpdate }) {
  const dispatch = useDispatch();
  const [newFiles, setNewFiles] = useState([]);
  const [removedFileIds, setRemovedFileIds] = useState([]);
  const currentType = media?.type?.toString().toLowerCase() || '';
  const currentTags = Array.isArray(media?.tags) ? media.tags.join(', ') : (media?.tags || '');
  const existingFiles = getMediaFiles(media);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      title: media?.title || '',
      description: media?.description || '',
      tags: currentTags,
      type: mediaTypes.includes(currentType) ? currentType : '',
    },
  });

  const descriptionValue = useWatch({ control, name: 'description' }) || '';

  useEffect(() => () => {
    newFiles.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
  }, [newFiles]);

  const handleNewFiles = (event) => {
    newFiles.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });

    const files = Array.from(event.target.files || []);
    const previews = files.map((file) => ({
      file,
      isImage: file.type.startsWith('image/'),
      previewUrl: URL.createObjectURL(file),
    }));

    setNewFiles(previews);
    setValue('files', files, { shouldDirty: true, shouldValidate: true });
  };

  const toggleRemoveFile = (fileId) => {
    setRemovedFileIds((current) =>
      current.includes(fileId)
        ? current.filter((id) => id !== fileId)
        : [...current, fileId]
    );
  };

  const appendFormDataField = (formData, key, value) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  };

  const onSubmit = async (data) => {
    const id = media?._id || media?.id;
    const payload = {};
    const tagsChanged = (data.tags || '') !== currentTags;

    if (data.title && data.title !== media?.title) payload.title = data.title;
    if ((data.description || '') !== (media?.description || '')) {
      payload.description = data.description || '';
    }
    if (data.type && data.type !== currentType) payload.type = data.type;
    if (tagsChanged) {
      payload.tags = data.tags ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [];
    }

    const selectedNewFiles = Array.from(data.files || []);
    const shouldUseFormData = selectedNewFiles.length > 0;
    const updatePayload = shouldUseFormData ? new FormData() : payload;

    if (shouldUseFormData) {
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'tags') {
          if (value.length === 0) {
            updatePayload.append('tags[]', '');
          } else {
            value.forEach((tag) => updatePayload.append('tags[]', tag));
          }
          return;
        }
        appendFormDataField(updatePayload, key, value);
      });
      selectedNewFiles.forEach((file) => updatePayload.append('files[]', file));
      removedFileIds.forEach((fileId) => updatePayload.append('remove_files[]', fileId));
    } else {
      if (removedFileIds.length > 0) {
        updatePayload.remove_files = removedFileIds;
      }
    }

    try {
      await dispatch(updateMedia({ id, data: updatePayload })).unwrap();
      setShowUpdate(false);
    } catch (err) {
      alert(err?.data?.message || err?.message || 'Failed to update media asset');
    }
  };

  return (
    <div style={m.container}>
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Update Media</h2>
          <p style={m.subtitle}>Edit details, add files, or remove selected files</p>
        </div>
        <button type="button" onClick={() => setShowUpdate(false)} style={m.closeBtn}>
          x
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={m.form}>
        <div style={m.grid}>
          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>
              Title <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input {...register('title')} style={m.input} />
            {errors.title && <span style={m.error}>{errors.title.message}</span>}
          </div>

          <div style={m.inputGroup}>
            <label style={m.label}>
              Type <span style={m.optionalLabel}>(optional)</span>
            </label>
            <select {...register('type')} style={m.input}>
              <option value="">Select type...</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            {errors.type && <span style={m.error}>{errors.type.message}</span>}
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
            <label style={m.label}>Existing Files</label>
            {existingFiles.length > 0 ? (
              <div style={m.fileGrid}>
                {existingFiles.map((file) => {
                  const removed = removedFileIds.includes(file.id);
                  return (
                    <div
                      style={{ ...m.fileCard, ...(removed ? m.fileCardRemoved : {}) }}
                      key={file.id}
                    >
                      {isVideo(file) ? (
                        file.thumbnail_url ? (
                          <img src={file.thumbnail_url} alt="" style={m.preview} />
                        ) : (
                          <video src={file.url} muted playsInline preload="metadata" style={m.preview} />
                        )
                      ) : (
                        <img src={file.url} alt="" style={m.preview} />
                      )}
                      <span style={m.fileName}>{file.original_name || file.path}</span>
                      <span style={m.fileMeta}>
                        {file.type || 'Media'} {file.size ? `- ${formatFileSize(file.size)}` : ''}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleRemoveFile(file.id)}
                        style={{
                          ...m.fileBtn,
                          background: removed ? 'var(--surface-high)' : 'rgba(192,57,43,0.1)',
                          color: removed ? 'var(--on-surface)' : 'var(--secondary)',
                        }}
                      >
                        {removed ? 'Keep file' : 'Remove file'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <span style={m.hint}>No files are attached yet.</span>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1', ...m.inputGroup }}>
            <label style={m.label}>
              Add More Files <span style={m.optionalLabel}>(optional)</span>
            </label>
            <input type="file" accept="image/*,video/*" multiple onChange={handleNewFiles} style={m.input} />
            <span style={m.hint}>Existing files stay unless you mark them for removal.</span>
            {errors.files && <span style={m.error}>{errors.files.message}</span>}
            {newFiles.length > 0 && (
              <div style={m.fileGrid}>
                {newFiles.map(({ file, isImage, previewUrl }) => (
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

        <div style={m.footer}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ ...m.submitBtn, opacity: isSubmitting ? 0.6 : 1 }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

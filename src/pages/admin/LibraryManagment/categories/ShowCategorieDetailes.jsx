import React from 'react';

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

export default function ShowCategorieDetails({ categorie, onClose }) {
  const banner = resolveAssetUrl(categorie?.banner);

  return (
    <div style={m.container}>
      <div style={m.header}>
        <h2 style={m.title}>{categorie?.name}</h2>
        <button type="button" onClick={onClose} style={m.closeBtn}>
          ✕
        </button>
      </div>

      <div style={m.body}>
        <Row label="Name" value={categorie?.name || '---'} />
        <Row label="Slug" value={categorie?.slug || '---'} />
        <Row label="Description" value={categorie?.description || '---'} />
        <Row label="Icon" value={categorie?.icon || '---'} />
        <div style={m.row}>
          <span style={m.label}>Image</span>
          {banner ? (
            <img src={banner} alt="" style={m.preview} />
          ) : (
            <span style={m.value}>---</span>
          )}
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div style={m.row}>
    <span style={m.label}>{label}</span>
    <span style={m.value}>{value}</span>
  </div>
);

const m = {
  container: { padding: 'clamp(1rem, 4vw, 2rem)' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.75rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--on-surface)',
    margin: 0,
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
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    fontSize: '0.85rem',
  },
  row: { display: 'flex', gap: '0.5rem 1rem', flexWrap: 'wrap' },
  label: {
    fontWeight: 600,
    color: 'var(--on-surface-muted)',
    minWidth: '120px',
  },
  value: { color: 'var(--on-surface)', minWidth: 0, overflowWrap: 'break-word' },
  preview: {
    width: 'min(100%, 220px)',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    borderRadius: '0.5rem',
  },
};

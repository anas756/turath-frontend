import React from 'react';

export default function ShowCategorieDetails({ categorie, onClose }) {
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
        <Row label="Banner" value={categorie?.banner || '---'} />
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
  container: { padding: '2rem' },
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
  row: { display: 'flex', gap: '1rem' },
  label: {
    fontWeight: 600,
    color: 'var(--on-surface-muted)',
    minWidth: '120px',
  },
  value: { color: 'var(--on-surface)' },
};

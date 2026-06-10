import React from 'react';

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
    flexShrink: 0,
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
  },
  valueBox: {
    padding: '0.6rem 0.85rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--surface-low)',
    fontSize: '0.875rem',
    color: 'var(--on-surface)',
    minHeight: '38px',
    lineHeight: 1.5,
  },
  valueBoxMuted: {
    padding: '0.6rem 0.85rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--surface-low)',
    fontSize: '0.875rem',
    color: 'var(--on-surface-muted)',
    fontStyle: 'italic',
    minHeight: '38px',
    lineHeight: 1.5,
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    padding: '0.5rem 0.85rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--surface-low)',
    minHeight: '38px',
    alignItems: 'center',
  },
  tag: {
    padding: '0.15rem 0.65rem',
    borderRadius: '9999px',
    fontSize: '0.72rem',
    fontWeight: 600,
    backgroundColor: 'rgba(99,70,29,0.1)',
    color: 'var(--tertiary)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
  },
  editBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: '9999px',
    background: 'var(--primary-gradient)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  openLibBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: '9999px',
    background: 'var(--surface-low)',
    color: 'var(--on-surface)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
};

const Field = ({ label, value, fullWidth, multiline }) => (
  <div style={{ ...(fullWidth ? { gridColumn: 'span 2' } : {}), ...m.fieldGroup }}>
    <label style={m.label}>{label}</label>
    {value
      ? <div style={multiline ? { ...m.valueBox, minHeight: '80px' } : m.valueBox}>{value}</div>
      : <div style={m.valueBoxMuted}>—</div>
    }
  </div>
);

export default function ShowDocumentDetailes({ doc, onClose, onEdit }) {
  if (!doc) return null;

  const isOpenLibrary = !!doc.open_library_key;
  const authors = Array.isArray(doc.authors)
    ? doc.authors.join(', ')
    : (doc.author || doc.authors || null);
  const tags = Array.isArray(doc.tags)
    ? doc.tags
    : (doc.tags ? doc.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
  const categoryName = doc.categorie?.name || doc.category || null;

  return (
    <div style={m.container}>

      {/* Header */}
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Document Details</h2>
          <p style={m.subtitle}>Details of this heritage document</p>
        </div>
        <button type="button" onClick={onClose} style={m.closeBtn}>✕</button>
      </div>

      {/* Fields grid */}
      <div style={{ ...m.grid, marginBottom: '1.5rem' }}>

        <Field label="Document Title" value={doc.title} fullWidth />

        <Field label="Authors" value={authors} />
        <Field label="Category" value={categoryName} />

        {(doc.language || doc.source) && (
          <>
            {doc.language && <Field label="Language" value={doc.language} />}
            {doc.source   && <Field label="Source"   value={doc.source} />}
          </>
        )}

        {/* Tags */}
        <div style={{ gridColumn: 'span 2', ...m.fieldGroup }}>
          <label style={m.label}>Tags</label>
          {tags.length > 0
            ? (
              <div style={m.tagsRow}>
                {tags.map((tag, i) => <span key={i} style={m.tag}>{tag}</span>)}
              </div>
            )
            : <div style={m.valueBoxMuted}>—</div>
          }
        </div>

        <Field label="Description" value={doc.description} fullWidth multiline />

        {isOpenLibrary && doc.open_library_key && (
          <Field label="Open Library Key" value={doc.open_library_key} fullWidth />
        )}

      </div>

      {/* Footer */}
      <div style={m.footer}>
        {isOpenLibrary && doc.open_library_key
          ? (
            <a
              href={`https://openlibrary.org/works/${doc.open_library_key}`}
              target="_blank"
              rel="noreferrer"
              style={m.openLibBtn}
            >
              ↗ View on Open Library
            </a>
          )
          : onEdit && (
            <button style={m.editBtn} onClick={() => onEdit(doc)}>
              Edit Document
            </button>
          )
        }
      </div>

    </div>
  );
}
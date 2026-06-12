import React from 'react';

const formatDate = (str) => {
  if (!str) return null;

  return new Date(str).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// ── Shared style tokens — identical to ShowMediaDetails ───────────────────────
const m = {
  container: {
    padding: 'clamp(1rem, 4vw, 2rem)',
  },

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

  identityCard: {
    background: 'var(--surface-white)',
    border: '1px solid var(--surface-high)',
    borderRadius: '1rem',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
  },

  assetTitle: {
    fontFamily: "'Noto Serif', serif",
    fontSize: '1.05rem',
    fontWeight: 600,
    color: 'var(--on-surface)',
    margin: 0,
  },

  assetMeta: {
    fontSize: '0.78rem',
    color: 'var(--on-surface-muted)',
    marginTop: '0.2rem',
    lineHeight: 1.5,
    maxWidth: '100%',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },

  typePill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.22rem 0.85rem',
    borderRadius: '9999px',
    fontSize: '0.72rem',
    fontWeight: 700,
    background: 'rgba(0,78,138,0.08)',
    color: 'var(--primary)',
    border: '1px solid rgba(0,78,138,0.14)',
    flexShrink: 0,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
    gap: '1.25rem',
    marginBottom: '1.25rem',
  },

  card: {
    background: 'var(--surface-white)',
    border: '1px solid var(--surface-high)',
    borderRadius: '1rem',
    padding: '1.25rem',
    minWidth: 0,
  },

  cardFull: {
    background: 'var(--surface-white)',
    border: '1px solid var(--surface-high)',
    borderRadius: '1rem',
    padding: '1.25rem',
    marginBottom: '1.25rem',
    minWidth: 0,
  },

  secLabel: {
    fontSize: '0.63rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--on-surface-muted)',
    marginBottom: '0.85rem',
  },

  list: {
    border: '1px solid var(--surface-low)',
    borderRadius: '0.625rem',
    overflow: 'hidden',
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '0.7rem 1rem',
    borderBottom: '1px solid var(--surface-low)',
  },

  rowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '0.7rem 1rem',
  },

  lbl: {
    fontSize: '0.75rem',
    color: 'var(--on-surface-muted)',
    fontWeight: 500,
    flexShrink: 0,
  },

  val: {
    fontSize: '0.78rem',
    color: 'var(--on-surface)',
    fontWeight: 600,
    textAlign: 'right',
    maxWidth: '180px',
    lineHeight: 1.35,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },

  valMuted: {
    fontSize: '0.78rem',
    color: 'var(--on-surface-muted)',
    fontStyle: 'italic',
    textAlign: 'right',
    maxWidth: '180px',
  },

  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },

  tag: {
    padding: '0.2rem 0.7rem',
    borderRadius: '9999px',
    fontSize: '0.72rem',
    fontWeight: 600,
    background: 'rgba(99,70,29,0.09)',
    color: 'var(--tertiary)',
  },

  descText: {
    fontSize: '0.85rem',
    color: 'var(--on-surface)',
    lineHeight: 1.7,
    margin: 0,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },

  descMuted: {
    fontSize: '0.85rem',
    color: 'var(--on-surface-muted)',
    fontStyle: 'italic',
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--surface-low)',
    flexWrap: 'wrap',
  },

  footerMeta: {
    fontSize: '0.72rem',
    color: 'var(--on-surface-muted)',
  },

  editBtn: {
    padding: '0.55rem 1.4rem',
    borderRadius: '9999px',
    background: 'var(--primary-gradient)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
};

const Val = ({ value }) =>
  value ? (
    <span style={m.val}>{value}</span>
  ) : (
    <span style={m.valMuted}>—</span>
  );

export default function ShowDocumentDetailes({ doc, onClose, onEdit }) {
  if (!doc) return null;

  const authors = Array.isArray(doc.authors)
    ? doc.authors.join(', ')
    : doc.authors || null;

  const tags = Array.isArray(doc.tags)
    ? doc.tags
    : doc.tags
      ? doc.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  const categoryName = doc.categorie?.name || doc.category || null;
  const addedAt = formatDate(doc.created_at || doc.dateAdded);
  const curatorName = doc.curator?.name || null;

  return (
    <div style={m.container}>
      {/* Header */}
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Document Details</h2>
          <p style={m.subtitle}>Details of this heritage document</p>
        </div>

        <button type="button" onClick={onClose} style={m.closeBtn}>
          ✕
        </button>
      </div>

      {/* Identity card */}
      <div style={m.identityCard}>
        <div style={{ minWidth: 0 }}>
          <p style={m.assetTitle}>{doc.title || '—'}</p>

          {(authors || addedAt) && (
            <p style={m.assetMeta}>
              {authors && `By ${authors}`}
              {authors && addedAt && ' · '}
              {addedAt && `Added ${addedAt}`}
            </p>
          )}
        </div>

        {categoryName && <span style={m.typePill}>{categoryName}</span>}
      </div>

      {/* Two-column info grid */}
      <div style={m.grid}>
        <div style={m.card}>
          <p style={m.secLabel}>Document Information</p>

          <div style={m.list}>
            <div style={m.row}>
              <span style={m.lbl}>Authors</span>
              <Val value={authors} />
            </div>

            <div style={m.row}>
              <span style={m.lbl}>Category</span>
              <Val value={categoryName} />
            </div>

            <div style={m.rowLast}>
              <span style={m.lbl}>Language</span>
              <Val value={doc.language} />
            </div>
          </div>
        </div>

        <div style={m.card}>
          <p style={m.secLabel}>Archive Information</p>

          <div style={m.list}>
            <div style={m.row}>
              <span style={m.lbl}>Source</span>
              <Val value={doc.source} />
            </div>

            <div style={m.row}>
              <span style={m.lbl}>Curator</span>
              <Val value={curatorName} />
            </div>

            <div style={m.rowLast}>
              <span style={m.lbl}>Date added</span>
              <Val value={addedAt} />
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div style={m.cardFull}>
        <p style={m.secLabel}>Tags</p>

        {tags.length > 0 ? (
          <div style={m.tagsRow}>
            {tags.map((t, i) => (
              <span key={i} style={m.tag}>
                {t}
              </span>
            ))}
          </div>
        ) : (
          <span style={m.descMuted}>No tags</span>
        )}
      </div>

      {/* Description */}
      <div style={{ ...m.cardFull, marginBottom: '1.5rem' }}>
        <p style={m.secLabel}>Description</p>

        {doc.description ? (
          <p style={m.descText}>{doc.description}</p>
        ) : (
          <span style={m.descMuted}>No description provided</span>
        )}
      </div>

      {/* Footer */}
      <div style={m.footer}>
        <span style={m.footerMeta}>
          {addedAt ? `Added ${addedAt}` : ''}
          {curatorName ? ` · ${curatorName}` : ''}
        </span>

        {onEdit && (
          <button style={m.editBtn} onClick={() => onEdit(doc)}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Document
          </button>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import RichText from '../../../components/common/RichText';

const formatDate = (str) => {
  if (!str) return null;
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatSize = (bytes) => {
  if (!bytes) return null;
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes, i = 0;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
};

const m = {
  container: { padding: 'clamp(1rem, 4vw, 2rem)' },

  // Header
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '1.75rem',
  },
  title:    { fontSize: '1.5rem', fontWeight: 600, color: 'var(--on-surface)', margin: 0 },
  subtitle: { color: 'var(--on-surface-muted)', fontSize: '0.85rem', marginTop: '0.25rem' },
  closeBtn: {
    background: 'var(--surface-low)', border: 'none',
    width: '32px', height: '32px', borderRadius: '50%',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },

  // Identity card (title + type badge)
  identityCard: {
    background: 'var(--surface-white)',
    border: '1px solid var(--surface-high)',
    borderRadius: '1rem',
    padding: '1.25rem 1.5rem',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: '1rem',
    marginBottom: '1.5rem', flexWrap: 'wrap',
  },
  assetTitle: {
    fontFamily: "'Noto Serif', serif",
    fontSize: '1.05rem', fontWeight: 600,
    color: 'var(--on-surface)', margin: 0,
  },
  assetMeta: { fontSize: '0.78rem', color: 'var(--on-surface-muted)', marginTop: '0.2rem' },
  typePill: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '0.22rem 0.85rem', borderRadius: '9999px',
    fontSize: '0.72rem', fontWeight: 700,
    background: 'rgba(0,78,138,0.08)', color: 'var(--primary)',
    border: '1px solid rgba(0,78,138,0.14)', flexShrink: 0,
  },

  // Two-column grid of info cards
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginBottom: '1.25rem' },

  // Info card (like profile page)
  card: {
    background: 'var(--surface-white)',
    border: '1px solid var(--surface-high)',
    borderRadius: '1rem', padding: '1.25rem',
  },
  cardFull: {
    background: 'var(--surface-white)',
    border: '1px solid var(--surface-high)',
    borderRadius: '1rem', padding: '1.25rem',
    marginBottom: '1.25rem',
  },
  secLabel: {
    fontSize: '0.63rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'var(--on-surface-muted)', marginBottom: '0.85rem',
  },
  list:    { border: '1px solid var(--surface-low)', borderRadius: '0.625rem', overflow: 'hidden' },
  row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem', borderBottom: '1px solid var(--surface-low)' },
  rowLast: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem' },
  lbl:     { fontSize: '0.75rem', color: 'var(--on-surface-muted)', fontWeight: 500 },
  val:     { fontSize: '0.82rem', color: 'var(--on-surface)', fontWeight: 600 },
  valMuted:{ fontSize: '0.82rem', color: 'var(--on-surface-muted)', fontStyle: 'italic' },

  // Tags
  tagsRow: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.1rem' },
  tag: {
    padding: '0.2rem 0.7rem', borderRadius: '9999px',
    fontSize: '0.72rem', fontWeight: 600,
    background: 'rgba(99,70,29,0.09)', color: 'var(--tertiary)',
  },

  // Description
  descText: {
    fontSize: '0.85rem', color: 'var(--on-surface)',
    lineHeight: 1.7, margin: 0,
  },
  descMuted: {
    fontSize: '0.85rem', color: 'var(--on-surface-muted)',
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1.25rem',
    borderTop: '1px solid var(--surface-low)',
  },
  footerMeta: { fontSize: '0.72rem', color: 'var(--on-surface-muted)' },
  editBtn: {
    padding: '0.55rem 1.4rem', borderRadius: '9999px',
    background: 'var(--primary-gradient)', color: '#fff',
    border: 'none', cursor: 'pointer',
    fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: '6px',
  },
};

const Val = ({ value }) => value
  ? <span style={m.val}>{value}</span>
  : <span style={m.valMuted}>—</span>;

export default function ShowMediaDetails({ media, onClose, onEdit }) {
  if (!media) return null;

  const tags        = Array.isArray(media.tags) ? media.tags : (media.tags ? media.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
  const curatorName = typeof media.curator === 'object' ? media.curator?.name : media.curator;
  const addedAt     = formatDate(media.date_added || media.created_at);
  const fileSize    = formatSize(media.size);

  return (
    <div style={m.container}>

      {/* Header */}
      <div style={m.header}>
        <div>
          <h2 style={m.title}>Media Details</h2>
          <p style={m.subtitle}>Details of this heritage asset</p>
        </div>
        <button type="button" onClick={onClose} style={m.closeBtn}>✕</button>
      </div>

      {/* Identity card */}
      <div style={m.identityCard}>
        <div>
          <p style={m.assetTitle}>{media.title || '—'}</p>
          {(curatorName || addedAt) && (
            <p style={m.assetMeta}>
              {curatorName && `Curated by ${curatorName}`}
              {curatorName && addedAt && ' · '}
              {addedAt && `Added ${addedAt}`}
            </p>
          )}
        </div>
        {media.type && <span style={m.typePill}>{media.type}</span>}
      </div>

      {/* Two-column info grid */}
      <div style={m.grid}>

        {/* File details */}
        <div style={m.card}>
          <p style={m.secLabel}>File Information</p>
          <div style={m.list}>
            <div style={m.row}>
              <span style={m.lbl}>Format</span>
              <Val value={media.format?.toUpperCase()} />
            </div>
            <div style={m.row}>
              <span style={m.lbl}>Resolution</span>
              <Val value={media.resolution} />
            </div>
            <div style={m.rowLast}>
              <span style={m.lbl}>File size</span>
              <Val value={fileSize} />
            </div>
          </div>
        </div>

        {/* Access info */}
        <div style={m.card}>
          <p style={m.secLabel}>Archive Information</p>
          <div style={m.list}>
            <div style={m.row}>
              <span style={m.lbl}>Curator</span>
              <Val value={curatorName} />
            </div>
            <div style={m.row}>
              <span style={m.lbl}>Date added</span>
              <Val value={addedAt} />
            </div>
            <div style={m.rowLast}>
              <span style={m.lbl}>Status</span>
              <Val value={media.status} />
            </div>
          </div>
        </div>

      </div>

      {/* Tags */}
      <div style={m.cardFull}>
        <p style={m.secLabel}>Tags</p>
        {tags.length > 0
          ? <div style={m.tagsRow}>{tags.map((t, i) => <span key={i} style={m.tag}>{t}</span>)}</div>
          : <span style={m.descMuted}>No tags</span>
        }
      </div>

      {/* Description */}
      <div style={{ ...m.cardFull, marginBottom: '1.5rem' }}>
        <p style={m.secLabel}>Description</p>
        {media.description
          ? <RichText html={media.description} className="rich-text rich-text--admin" style={m.descText} />
          : <span style={m.descMuted}>No description provided</span>
        }
      </div>

      {/* Footer */}
      <div style={m.footer}>
        <span style={m.footerMeta}>
          {addedAt ? `Added ${addedAt}` : ''}
          {curatorName ? ` · ${curatorName}` : ''}
        </span>
        {onEdit && (
          <button style={m.editBtn} onClick={() => onEdit(media)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Asset
          </button>
        )}
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { mediaItems } from '../../data/admin/media';
// When dynamic: dispatch(fetchMedia())
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import CuratorAvatar from '../../components/admin/CuratorAvatar';

const TYPES = ['All', 'Image', 'Audio', 'Video'];

const TYPE_ICONS = {
  Image: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Audio: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Video: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
};

export default function MediaLibrary() {
  const [activeType, setActiveType] = useState('All');

  // When dynamic: replace with Redux state
  const filtered = mediaItems.filter(m => activeType === 'All' || m.type === activeType);

  return (
    <>
      <PageHeader
        title="Media Library"
        subtitle="Images, audio recordings and video assets of Moroccan heritage."
        action={
          <button className="btn-add-doc">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Upload Asset
          </button>
        }
      />

      <div className="filter-bar">
        <div className="filter-chips">
          {TYPES.map(t => (
            <button
              key={t}
              className={`filter-chip ${activeType === t ? 'active' : ''}`}
              onClick={() => setActiveType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">{filtered.length} Assets</h2>
        </div>
        <table className="content-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Format</th>
              <th>Resolution</th>
              <th>Size</th>
              <th>Curator</th>
              <th>Date Added</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-muted)' }}>
                    {item.tags.join(' · ')}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)' }}>
                    {TYPE_ICONS[item.type]}
                    <span style={{ fontSize: '0.78rem' }}>{item.type}</span>
                  </div>
                </td>
                <td className="date-text">{item.format}</td>
                <td className="date-text">{item.resolution}</td>
                <td className="date-text">{item.size}</td>
                <td><CuratorAvatar initials={item.curator.initials} name={item.curator.name} /></td>
                <td className="date-text">{item.dateAdded}</td>
                <td><StatusBadge status={item.status} /></td>
                <td>
                  <button className="action-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
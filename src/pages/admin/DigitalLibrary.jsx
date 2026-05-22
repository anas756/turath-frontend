import React, { useState } from 'react';
import { documents } from '../../data/admin/documents';
// When dynamic: import { useEffect } from 'react'; dispatch(fetchDocuments())
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import CuratorAvatar from '../../components/admin/CuratorAvatar';

const CATEGORIES = ['All', 'Manuscript', 'Architecture', 'Correspondence'];

export default function DigitalLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // When dynamic: replace this with data from Redux store
  const filtered = documents.filter(doc => {
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHeader
        title="Digital Library"
        subtitle="Browse and manage all archived documents and manuscripts."
        action={
          <button className="btn-add-doc">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Document
          </button>
        }
      />

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-chips">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="filter-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search documents…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">{filtered.length} Documents</h2>
        </div>
        <table className="content-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Language</th>
              <th>Pages</th>
              <th>Curator</th>
              <th>Date Added</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(doc => (
              <tr key={doc.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{doc.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-muted)' }}>{doc.collection}</div>
                </td>
                <td><span className={`chip chip-${doc.category.toLowerCase().replace(' ', '-')}`}>{doc.category}</span></td>
                <td className="date-text">{doc.language}</td>
                <td className="date-text">{doc.pages}</td>
                <td><CuratorAvatar initials={doc.curator.initials} name={doc.curator.name} /></td>
                <td className="date-text">{doc.dateAdded}</td>
                <td><StatusBadge status={doc.status} /></td>
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
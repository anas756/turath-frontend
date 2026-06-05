// src/pages/admin/LibraryManagment/DigitalLibrary.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllDocs,
  getAllCategoris,
  deleteDoc,
} from '../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';
import PageHeader from '../../../components/admin/PageHeader';
import StatusBadge from '../../../components/admin/StatusBadge';
import AdminLoading from '../../../components/admin/AdminLoading';
import StoreDocument from './StoreDocument';

export default function DigitalLibrary() {
  const dispatch = useDispatch();
  const { documents = [], categories = [], loading = false } = useSelector(
    (state) => state.library || {}
  );

  const [search, setSearch]             = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showStore, setShowStore]       = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [loadingRows, setLoadingRows]   = useState({});

  useEffect(() => {
    if (!documents.length) dispatch(getAllDocs());
    if (!categories.length) dispatch(getAllCategoris());
  }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.lib-action-btn')) setActiveMenuId(null);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const filtered = documents.filter((doc) => {
    const matchCat = activeCategory === 'All' || doc.category?.name === activeCategory;
    const matchSearch = (doc.title || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleDelete = async (doc) => {
    const id = doc._id || doc.id;
    if (!window.confirm(`Delete "${doc.title}"?`)) return;
    setLoadingRows((p) => ({ ...p, [id]: 'deleting' }));
    try {
      await dispatch(deleteDoc(id)).unwrap();
    } catch {
      alert('Delete failed');
    } finally {
      setLoadingRows((p) => ({ ...p, [id]: false }));
      setActiveMenuId(null);
    }
  };

  /* ─── language chip colours ─── */
  const langColor = (lang) => {
    const map = {
      Arabic:   { bg: 'rgba(0,78,138,0.08)',   color: '#004e8a' },
      French:   { bg: 'rgba(99,70,29,0.08)',    color: '#63461d' },
      Amazigh:  { bg: 'rgba(159,64,45,0.08)',   color: '#9f402d' },
      English:  { bg: 'rgba(45,122,79,0.1)',    color: '#2d7a4f' },
    };
    return map[lang] || { bg: 'var(--surface-high)', color: 'var(--on-surface-muted)' };
  };

  return (
    <div style={{ position: 'relative' }}>

      {/* ── Page Header ── */}
      <PageHeader
        title="Digital Library"
        subtitle="Browse and manage all archived heritage documents."
        action={
          <button
            onClick={() => setShowStore(true)}
            style={{
              background: 'var(--primary-gradient)',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '0.375rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Document
          </button>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : (
        <>
          {/* ── Filter Bar ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['All', ...categories.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    backgroundColor: activeCategory === cat ? 'var(--primary)' : 'var(--surface-high)',
                    color: activeCategory === cat ? 'white' : 'var(--on-surface-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--surface-high)', borderRadius: '9999px', padding: '0.25rem 1rem' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--tertiary)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search documents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', padding: '0.5rem 0', fontSize: '0.85rem', width: '200px', color: 'var(--on-surface)' }}
              />
            </div>
          </div>

          {/* ── Table ── */}
          <div style={{ backgroundColor: 'var(--surface-white)', borderRadius: '1rem', boxShadow: 'var(--shadow-lift)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
              <thead style={{ backgroundColor: 'var(--surface-low)' }}>
                <tr style={{ textAlign: 'left' }}>
                  {['Document', 'Category', 'Language', 'Curator', 'Status', ''].map((h) => (
                    <th key={h} style={{ padding: '1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-muted)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-muted)', fontSize: '0.9rem' }}>
                      No documents found.
                    </td>
                  </tr>
                ) : filtered.map((doc) => {
                  const id = doc._id || doc.id;
                  const lc = langColor(doc.language);
                  return (
                    <tr key={id} style={{ borderTop: '1px solid var(--surface-low)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-low)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Document title + author */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '0.5rem',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--on-surface)' }}>{doc.title}</div>
                            {doc.author && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-muted)', marginTop: '2px' }}>{doc.author}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-block', padding: '0.25rem 0.75rem',
                          borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600,
                          backgroundColor: 'rgba(99,70,29,0.08)', color: 'var(--tertiary)',
                        }}>
                          {doc.category?.name || '—'}
                        </span>
                      </td>

                      {/* Language */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-block', padding: '0.25rem 0.65rem',
                          borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600,
                          backgroundColor: lc.bg, color: lc.color,
                        }}>
                          {doc.language || '—'}
                        </span>
                      </td>

                      {/* Curator */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--secondary), #e2725b)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: '0.65rem', flexShrink: 0,
                          }}>
                            {getInitials(doc.curator?.name)}
                          </div>
                          <span style={{ fontSize: '0.82rem', color: 'var(--on-surface-muted)', whiteSpace: 'nowrap' }}>
                            {doc.curator?.name || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem' }}>
                        <StatusBadge status={doc.status} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem', position: 'relative' }}>
                        <button
                          className="lib-action-btn"
                          disabled={!!loadingRows[id]}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === id ? null : id);
                          }}
                          style={{
                            background: 'none', border: 'none', width: '32px', height: '32px',
                            borderRadius: '0.375rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          {loadingRows[id] ? (
                            <div style={{ width: '15px', height: '15px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          ) : (
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                            </svg>
                          )}
                        </button>

                        {activeMenuId === id && !loadingRows[id] && (
                          <div style={{
                            position: 'absolute', right: 0, top: '42px',
                            backgroundColor: 'white', borderRadius: '0.5rem',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                            minWidth: '150px', zIndex: 20, overflow: 'hidden',
                          }}>
                            <button style={{ display: 'block', width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                              📄 View Details
                            </button>
                            <button style={{ display: 'block', width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(doc)}
                              style={{ display: 'block', width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--secondary)' }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Row count */}
          <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--on-surface-muted)', textAlign: 'right' }}>
            Showing {filtered.length} of {documents.length} document{documents.length !== 1 ? 's' : ''}
          </p>
        </>
      )}

      {/* ── Add Document Modal ── */}
      {showStore && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--surface-white)', borderRadius: '1rem',
            width: '90%', maxWidth: '620px',
            maxHeight: '88vh', overflow: 'auto',
            boxShadow: 'var(--shadow-lift)',
          }}>
            <StoreDocument setShowStore={() => setShowStore(false)} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .lib-action-btn:hover { background: var(--surface-low) !important; }
      `}</style>
    </div>
  );
}
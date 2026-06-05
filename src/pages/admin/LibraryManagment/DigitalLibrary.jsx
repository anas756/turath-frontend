import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllDocs,
  getAllCategoris,
} from '../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';
import PageHeader from '../../../components/admin/PageHeader';
import StatusBadge from '../../../components/admin/StatusBadge';
import CuratorAvatar from '../../../components/admin/CuratorAvatar';
import AdminLoading from '../../../components/admin/AdminLoading';

export default function DigitalLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const dispatch = useDispatch();
  const hasFetched = useRef(false); // Ref pour éviter les doubles appels

  const {
    documents = [],
    categories = [],
    loading = false,
  } = useSelector((state) => state.library || {});

  // Correction 1: useEffect avec dispatch conditionnel
  useEffect(() => {
    // Utiliser un ref pour ne faire l'appel qu'une seule fois
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getAllDocs());
      dispatch(getAllCategoris());
    }
  }, [dispatch]); // dispatch est stable, n'exécute qu'une fois

  // Correction 2: Si vous voulez pouvoir rafraîchir manuellement
  const fetchLibrary = useCallback(
    (forceRefresh = false) => {
      if (forceRefresh) {
        dispatch(getAllDocs());
        dispatch(getAllCategoris());
      }
    },
    [dispatch]
  );

  const filtered = (documents || []).filter((doc) => {
    const matchesCategory =
      activeCategory === 'All' || doc.category?.name === activeCategory;
    const matchesSearch =
      doc.title?.toLowerCase().includes(search.toLowerCase()) ||
      doc.language?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="turath-library-management">
      <PageHeader
        title="Digital Library"
        subtitle="Browse and manage all archived documents."
        action={
          <button
            className="btn-add-doc"
            onClick={() => {
              /* Ajoutez votre logique */
            }}
            style={{
              background: 'var(--primary-gradient)',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '0.375rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Add Document
          </button>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : (
        <>
          {/* Reste de votre JSX identique */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveCategory('All')}
                style={chipStyle(activeCategory === 'All')}
              >
                All
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  style={chipStyle(activeCategory === cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--surface-high)',
                borderRadius: '9999px',
                padding: '0.25rem 1rem',
              }}
            >
              <input
                type="text"
                placeholder="Search documents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '0.5rem 0',
                  fontSize: '0.85rem',
                  width: '200px',
                }}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface-white)',
              borderRadius: '1rem',
              boxShadow: 'var(--shadow-lift)',
              overflowX: 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '700px',
              }}
            >
              <thead style={{ backgroundColor: 'var(--surface-low)' }}>
                <tr style={{ textAlign: 'left' }}>
                  {[
                    'Title',
                    'Category',
                    'Language',
                    'Curator',
                    'Status',
                    '',
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '1rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: 'var(--on-surface-muted)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    style={{ borderTop: '1px solid var(--surface-low)' }}
                  >
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      {doc.title}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        className="chip"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          background: 'var(--surface-low)',
                          borderRadius: '4px',
                        }}
                      >
                        {doc.category?.name}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                      {doc.language}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <CuratorAvatar name={doc.curator?.name} />
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={doc.status} />
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        className="action-btn"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const chipStyle = (isActive) => ({
  padding: '0.5rem 1.25rem',
  borderRadius: '9999px',
  fontSize: '0.85rem',
  fontWeight: 500,
  backgroundColor: isActive ? 'var(--primary)' : 'var(--surface-high)',
  color: isActive ? 'white' : 'var(--on-surface-muted)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
});

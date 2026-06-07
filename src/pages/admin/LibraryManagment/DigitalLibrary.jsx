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
import StoreCategories from './StoreCategories'; // تأكدي من المسار الصحيح

export default function DigitalLibrary() {
  const dispatch = useDispatch();
  const {
    documents = [],
    categories = [],
    loading = false,
  } = useSelector((state) => state.library || {});

  const [activeTab, setActiveTab] = useState('documents');
  const [showStore, setShowStore] = useState(false);
  const [showStoreCategory, setShowStoreCategory] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(getAllDocs());
    dispatch(getAllCategoris());
  }, [dispatch]);

  return (
    <div style={{ padding: '2rem' }}>
      <PageHeader
        title="Digital Library"
        subtitle="Manage heritage documents and categories"
        action={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowStoreCategory(true)}
              style={styles.btnSecondary}
            >
              + Add Category
            </button>
            <button
              onClick={() => setShowStore(true)}
              style={styles.btnPrimary}
            >
              + Add Document
            </button>
          </div>
        }
      />

      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('documents')}
          style={activeTab === 'documents' ? styles.activeTab : styles.tab}
        >
          Documents
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          style={activeTab === 'categories' ? styles.activeTab : styles.tab}
        >
          Categories
        </button>
      </div>

      {loading ? (
        <AdminLoading />
      ) : (
        <div style={styles.tableContainer}>
          {activeTab === 'documents' ? (
            <DocumentsTable
              data={documents.filter((d) =>
                d.title.toLowerCase().includes(search.toLowerCase())
              )}
              search={search}
              setSearch={setSearch}
            />
          ) : (
            <CategoriesTable data={categories} />
          )}
        </div>
      )}

      {/* Modals */}
      {showStore && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <StoreDocument setShowStore={setShowStore} />
          </div>
        </div>
      )}

      {showStoreCategory && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <StoreCategories setShowStore={setShowStoreCategory} />
          </div>
        </div>
      )}
    </div>
  );
}

// --- TABLEAU DOCUMENTS ---
const DocumentsTable = ({ data, search, setSearch }) => (
  <>
    <input
      placeholder="Search documents..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={styles.input}
    />
    <table style={styles.table}>
      <thead style={{ backgroundColor: 'var(--surface-low)' }}>
        <tr>
          <th style={styles.th}>Document</th>
          <th style={styles.th}>Category</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((doc) => (
          <tr key={doc.id} style={styles.tr}>
            <td style={styles.td}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <div style={styles.docIcon}>📄</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{doc.title}</div>
                  <div style={{ fontSize: '0.75rem' }}>{doc.author}</div>
                </div>
              </div>
            </td>
            <td style={styles.td}>
              <span style={styles.badge}>{doc.category?.name || '---'}</span>
            </td>
            <td style={styles.td}>
              <StatusBadge status={doc.status} />
            </td>
            <td style={styles.td}>•••</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

// --- TABLEAU CATEGORIES ---
const CategoriesTable = ({ data }) => (
  <table style={styles.table}>
    <thead style={{ backgroundColor: 'var(--surface-low)' }}>
      <tr>
        <th style={styles.th}>Name</th>
        <th style={styles.th}>Slug</th>
        <th style={styles.th}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((cat) => (
        <tr key={cat.id} style={styles.tr}>
          <td style={styles.td}>{cat.name}</td>
          <td style={styles.td}>{cat.slug}</td>
          <td style={styles.td}>
            <button
              style={{
                border: 'none',
                background: 'none',
                color: 'var(--secondary)',
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// --- STYLES ---
const styles = {
  tableContainer: {
    backgroundColor: 'var(--surface-white)',
    borderRadius: '1rem',
    boxShadow: 'var(--shadow-lift)',
    padding: '1rem',
  },
  tabsContainer: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--surface-high)',
  },
  tab: {
    padding: '0.5rem 0',
    background: 'none',
    border: 'none',
    color: 'var(--on-surface-muted)',
    cursor: 'pointer',
    fontWeight: 600,
  },
  activeTab: {
    padding: '0.5rem 0',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid var(--primary)',
    color: 'var(--primary)',
    cursor: 'pointer',
    fontWeight: 600,
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    color: 'var(--on-surface-muted)',
  },
  tr: { borderTop: '1px solid var(--surface-low)' },
  td: { padding: '1rem', fontSize: '0.85rem' },
  docIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '0.5rem',
    background:
      'linear-gradient(135deg, var(--primary), var(--primary-container))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    backgroundColor: 'rgba(99,70,29,0.08)',
    color: 'var(--tertiary)',
    fontWeight: 600,
  },
  btnPrimary: {
    background: 'var(--primary-gradient)',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '0.375rem',
    cursor: 'pointer',
  },
  btnSecondary: {
    background: 'var(--surface-high)',
    color: 'var(--on-surface)',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '0.375rem',
    cursor: 'pointer',
  },
  input: {
    padding: '0.6rem',
    marginBottom: '1rem',
    width: '100%',
    borderRadius: '0.5rem',
    border: '1px solid var(--surface-low)',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'var(--surface-white)',
    borderRadius: '1rem',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
};

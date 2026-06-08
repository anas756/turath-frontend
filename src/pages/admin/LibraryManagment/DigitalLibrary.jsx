import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllDocs,
  getAllCategoris,
  deleteDoc,
  deleteCategory,
} from '../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';
import PageHeader from '../../../components/admin/PageHeader';
import StatusBadge from '../../../components/admin/StatusBadge';
import AdminLoading from '../../../components/admin/AdminLoading';
import StoreDocument from './StoreDocument';
import StoreCategories from './StoreCategories';

export default function DigitalLibrary() {
  const dispatch = useDispatch();
  const {
    documents = [],
    categories = [],
    documentsLoading = false,
    categoriesLoading = false,
  } = useSelector((state) => state.library || {});

  const [activeTab, setActiveTab] = useState('documents');
  const [showStore, setShowStore] = useState(false);
  const [showStoreCategory, setShowStoreCategory] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showUpdateCategory, setShowUpdateCategory] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loadingRows, setLoadingRows] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    fetchData();
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const fetchData = (forceRefresh = false) => {
    if (!forceRefresh && documents.length && categories.length) return;
    dispatch(getAllDocs());
    dispatch(getAllCategoris());
  };

  const handleDeleteDoc = async (doc) => {
    const id = doc._id || doc.id;
    if (!window.confirm(`Delete "${doc.title}"?`)) return;
    setLoadingRows((prev) => ({ ...prev, [id]: true }));
    try {
      await dispatch(deleteDoc(id)).unwrap();
    } catch (err) {
      alert(err?.message || 'Failed to delete document');
    } finally {
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
      setActiveMenuId(null);
    }
  };

  const handleDeleteCategory = async (cat) => {
    const id = cat._id || cat.id;
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    setLoadingRows((prev) => ({ ...prev, [id]: true }));
    try {
      await dispatch(deleteCategory(id)).unwrap();
    } catch (err) {
      alert(err?.message || 'Failed to delete category');
    } finally {
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
      setActiveMenuId(null);
    }
  };

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

      {activeTab === 'documents' ? (
        documentsLoading && !documents.length ? (
          <AdminLoading />
        ) : (
          <div style={styles.tableContainer}>
            <DocumentsTable
              data={documents.filter((d) =>
                d.title.toLowerCase().includes(search.toLowerCase())
              )}
              search={search}
              setSearch={setSearch}
              loadingRows={loadingRows}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onDetails={(doc) => {
                setSelectedDoc(doc);
                setShowDetails(true);
                setActiveMenuId(null);
              }}
              onUpdate={(doc) => {
                setSelectedDoc(doc);
                setShowUpdate(true);
                setActiveMenuId(null);
              }}
              onDelete={handleDeleteDoc}
            />
          </div>
        )
      ) : categoriesLoading && !categories.length ? (
        <AdminLoading />
      ) : (
        <div style={styles.tableContainer}>
          <CategoriesTable
            data={categories}
            loadingRows={loadingRows}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            onUpdate={(cat) => {
              setSelectedCategory(cat);
              setShowUpdateCategory(true);
              setActiveMenuId(null);
            }}
            onDelete={handleDeleteCategory}
          />
        </div>
      )}

      {/* — Doc Modals — */}
      {showStore && (
        <Modal
          onClose={() => {
            setShowStore(false);
            fetchData(true);
          }}
        >
          <StoreDocument
            setShowStore={(val) => {
              setShowStore(val);
              if (!val) fetchData(true);
            }}
          />
        </Modal>
      )}

      {showDetails && selectedDoc && (
        <Modal
          onClose={() => {
            setShowDetails(false);
            setSelectedDoc(null);
          }}
        >
          <DocDetails
            doc={selectedDoc}
            onClose={() => {
              setShowDetails(false);
              setSelectedDoc(null);
            }}
          />
        </Modal>
      )}

      {showUpdate && selectedDoc && (
        <Modal
          onClose={() => {
            setShowUpdate(false);
            setSelectedDoc(null);
          }}
        >
          {/* Wire up your UpdateDocument component here */}
          <div style={{ padding: '2rem' }}>
            <h2>Update Document (wire your form here)</h2>
          </div>
        </Modal>
      )}

      {/* — Category Modals — */}
      {showStoreCategory && (
        <Modal
          onClose={() => {
            setShowStoreCategory(false);
            fetchData(true);
          }}
        >
          <StoreCategories
            setShowStore={(val) => {
              setShowStoreCategory(val);
              if (!val) fetchData(true);
            }}
          />
        </Modal>
      )}

      {showUpdateCategory && selectedCategory && (
        <Modal
          onClose={() => {
            setShowUpdateCategory(false);
            setSelectedCategory(null);
          }}
        >
          {/* Wire up your UpdateCategory component here */}
          <div style={{ padding: '2rem' }}>
            <h2>Update Category (wire your form here)</h2>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- MODAL WRAPPER ---
const Modal = ({ children, onClose }) => (
  <div style={styles.modalOverlay} onClick={onClose}>
    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

// --- DOC DETAILS ---
const DocDetails = ({ doc, onClose }) => (
  <div style={{ padding: '2rem' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
        {doc.title}
      </h2>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
        }}
      >
        ✕
      </button>
    </div>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        fontSize: '0.85rem',
      }}
    >
      <Row
        label="Authors"
        value={
          Array.isArray(doc.authors) ? doc.authors.join(', ') : doc.authors
        }
      />
      <Row label="Category" value={doc.categorie?.name || '---'} />
      <Row label="Source" value={doc.source || '---'} />
      <Row
        label="Tags"
        value={
          Array.isArray(doc.tags) ? doc.tags.join(', ') : doc.tags || '---'
        }
      />
      <Row label="Description" value={doc.description || '---'} />
      {doc.open_library_key && (
        <Row label="Open Library Key" value={doc.open_library_key} />
      )}
    </div>
  </div>
);

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', gap: '1rem' }}>
    <span
      style={{
        fontWeight: 600,
        color: 'var(--on-surface-muted)',
        minWidth: '120px',
      }}
    >
      {label}
    </span>
    <span style={{ color: 'var(--on-surface)' }}>{value}</span>
  </div>
);

// --- DOCUMENTS TABLE ---
const DocumentsTable = ({
  data,
  search,
  setSearch,
  loadingRows,
  activeMenuId,
  setActiveMenuId,
  onDetails,
  onUpdate,
  onDelete,
}) => (
  <>
    <input
      placeholder="Search documents..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={styles.input}
    />
    {data.length === 0 ? (
      <div style={styles.empty}>No documents found.</div>
    ) : (
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
          {data.map((doc) => {
            const id = doc._id || doc.id;
            const isFromOpenLibrary = !!doc.open_library_key;
            return (
              <tr key={id} style={styles.tr}>
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
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--on-surface-muted)',
                        }}
                      >
                        {Array.isArray(doc.authors)
                          ? doc.authors.join(', ')
                          : doc.authors}
                      </div>
                      {isFromOpenLibrary && (
                        <span style={styles.openLibBadge}>Open Library</span>
                      )}
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.badge}>
                    {doc.categorie?.name || '---'}
                  </span>
                </td>
                <td style={styles.td}>
                  <StatusBadge status={doc.status} />
                </td>
                <td style={{ ...styles.td, position: 'relative' }}>
                  <button
                    className="action-btn"
                    disabled={!!loadingRows[id]}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === id ? null : id);
                    }}
                    style={styles.menuBtn}
                  >
                    {loadingRows[id] ? <Spinner /> : '•••'}
                  </button>
                  {activeMenuId === id && (
                    <div style={styles.dropdown}>
                      <DropdownItem onClick={() => onDetails(doc)}>
                        👁 View Details
                      </DropdownItem>
                      {/* update/delete only if NOT from open library */}
                      {!isFromOpenLibrary && (
                        <>
                          <DropdownItem onClick={() => onUpdate(doc)}>
                            ✏️ Edit
                          </DropdownItem>
                          <DropdownItem onClick={() => onDelete(doc)} danger>
                            🗑️ Delete
                          </DropdownItem>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </>
);

// --- CATEGORIES TABLE ---
const CategoriesTable = ({
  data,
  loadingRows,
  activeMenuId,
  setActiveMenuId,
  onUpdate,
  onDelete,
}) => (
  <>
    {data.length === 0 ? (
      <div style={styles.empty}>No categories found.</div>
    ) : (
      <table style={styles.table}>
        <thead style={{ backgroundColor: 'var(--surface-low)' }}>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Slug</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cat) => {
            const id = cat._id || cat.id;
            return (
              <tr key={id} style={styles.tr}>
                <td style={styles.td}>{cat.name}</td>
                <td style={styles.td}>{cat.slug}</td>
                <td style={{ ...styles.td, position: 'relative' }}>
                  <button
                    className="action-btn"
                    disabled={!!loadingRows[id]}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === id ? null : id);
                    }}
                    style={styles.menuBtn}
                  >
                    {loadingRows[id] ? <Spinner /> : '•••'}
                  </button>
                  {activeMenuId === id && (
                    <div style={styles.dropdown}>
                      <DropdownItem onClick={() => onUpdate(cat)}>
                        ✏️ Edit
                      </DropdownItem>
                      <DropdownItem onClick={() => onDelete(cat)} danger>
                        🗑️ Delete
                      </DropdownItem>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </>
);

// --- HELPERS ---
const DropdownItem = ({ children, onClick, danger }) => (
  <button
    onClick={onClick}
    style={{
      display: 'block',
      width: '100%',
      padding: '0.5rem 1rem',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.82rem',
      color: danger ? 'var(--secondary)' : 'var(--on-surface)',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </button>
);

const Spinner = () => (
  <div
    style={{
      width: '14px',
      height: '14px',
      border: '2px solid var(--primary)',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      display: 'inline-block',
    }}
  />
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
  openLibBadge: {
    display: 'inline-block',
    marginTop: '0.2rem',
    padding: '0.1rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.65rem',
    backgroundColor: 'rgba(0,78,138,0.08)',
    color: 'var(--primary)',
    fontWeight: 600,
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    color: 'var(--on-surface-muted)',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '40px',
    backgroundColor: 'var(--surface-white)',
    borderRadius: '0.5rem',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    minWidth: '150px',
    zIndex: 20,
    overflow: 'hidden',
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
    backgroundColor: 'var(--surface-low)',
    outline: 'none',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--on-surface-muted)',
    fontSize: '0.85rem',
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
    maxWidth: '650px',
    maxHeight: '85vh',
    overflow: 'auto',
  },
};

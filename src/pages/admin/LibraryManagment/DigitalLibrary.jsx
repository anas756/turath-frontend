import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllDocs,
  getAllCategoris,
  deleteDoc,
  deleteCategory,
} from '../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';
import { setErrorMessage, setSuccessMessage } from '../../../app/services/reduxTollkit/Slices/MessageSlice';
import PageHeader from '../../../components/admin/PageHeader';
import PaginationControls from '../../../components/admin/PaginationControls';
import StoreDocument from './document/StoreDocument';
import StoreCategories from './categories/StoreCategories';
import UpdateDocument from './document/UpdateDocument';
import UpdateCategorie from './categories/UpdateCategoei';
import ShowDocumentDetailes from './document/ShowDocumentDetailes';

const PAGE_SIZE = 10;

const assetBaseUrl = (
  import.meta.env.VITE_BACK_END_URL_IMAGE ||
  import.meta.env.VITE_BACK_END_URL ||
  ''
)
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

function resolveAssetUrl(path) {
  const value = path?.toString().trim();
  if (!value || value === 'null') return null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  const cleanPath = value.replace(/^\/+/, '');
  const publicPath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
  return `${assetBaseUrl}/${publicPath}`;
}

function formatAuthors(authors) {
  if (Array.isArray(authors)) return authors.filter(Boolean).join(', ');
  return authors || 'Unknown author';
}

function documentSourceLabel(doc) {
  switch (doc?.source) {
    case 'gutendex':
      return 'Gutendex';
    case 'google_books':
      return 'Google Books';
    case 'internet_archive':
      return 'Internet Archive';
    case 'open_library':
      return 'Open Library';
    default:
      return doc?.open_library_key ? 'Open Library' : '';
  }
}

function isActiveImport(status) {
  return ['queued', 'importing'].includes(status);
}

function isFinishedImport(status) {
  return ['completed', 'failed'].includes(status);
}

export default function DigitalLibrary() {
  const dispatch = useDispatch();
  const {
    documents = [],
    categories = [],
    documentsPagination,
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
  const [categoryFilter, setCategoryFilter] = useState('');
  const [documentsPage, setDocumentsPage] = useState(1);
  const [loadingRows, setLoadingRows] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);
  const importStatusRef = useRef(new Map());
  const importHydratedRef = useRef(false);

  const buildDocumentParams = useCallback((page = documentsPage) => {
    const params = {
      page,
      per_page: PAGE_SIZE,
    };

    if (search.trim()) params.search = search.trim();
    if (categoryFilter) params.categorie_id = categoryFilter;

    return params;
  }, [categoryFilter, documentsPage, search]);

  const fetchData = (forceRefresh = false) => {
    dispatch(getAllDocs(buildDocumentParams(documentsPage)));
    if (forceRefresh || !categories.length) dispatch(getAllCategoris());
  };

  useEffect(() => {
    if (!categories.length) dispatch(getAllCategoris());

    const handleOutsideClick = (event) => {
      if (
        event.target.closest('.action-btn') ||
        event.target.closest('.admin-action-menu')
      ) {
        return;
      }
      setActiveMenuId(null);
    };

    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [categories.length, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getAllDocs(buildDocumentParams(documentsPage)));
    }, 300);

    return () => clearTimeout(timer);
  }, [buildDocumentParams, dispatch, documentsPage]);

  useEffect(() => {
    const activeImports = categories.filter((category) => isActiveImport(category.import_status));

    if (!activeImports.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      dispatch(getAllCategoris());
      dispatch(getAllDocs(buildDocumentParams(documentsPage)));
    }, 5000);

    return () => window.clearInterval(timer);
  }, [buildDocumentParams, categories, dispatch, documentsPage]);

  useEffect(() => {
    const previousStatuses = importStatusRef.current;
    const nextStatuses = new Map();

    categories.forEach((category) => {
      const id = category._id || category.id;
      if (!id) return;

      const status = category.import_status || '';
      const previousStatus = previousStatuses.get(id);
      nextStatuses.set(id, status);

      if (
        importHydratedRef.current &&
        isActiveImport(previousStatus) &&
        isFinishedImport(status)
      ) {
        const message = category.import_message || (
          status === 'completed'
            ? `Book import finished for ${category.name}.`
            : `Book import failed for ${category.name}.`
        );

        if (status === 'completed') {
          dispatch(setSuccessMessage(message));
          dispatch(getAllDocs(buildDocumentParams(documentsPage)));
        } else {
          dispatch(setErrorMessage(message));
        }
      }
    });

    importStatusRef.current = nextStatuses;

    if (!categoriesLoading) {
      importHydratedRef.current = true;
    }
  }, [buildDocumentParams, categories, categoriesLoading, dispatch, documentsPage]);

  const handleDeleteDoc = async (doc) => {
    const id = doc._id || doc.id;
    if (!window.confirm(`Delete "${doc.title}"?`)) return;

    setLoadingRows((prev) => ({ ...prev, [id]: true }));
    try {
      await dispatch(deleteDoc(id)).unwrap();
      dispatch(getAllDocs(buildDocumentParams(documentsPage)));
    } catch (err) {
      alert(err?.message || 'Failed to delete document');
    } finally {
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
      setActiveMenuId(null);
    }
  };

  const handleDeleteCategory = async (category) => {
    const id = category._id || category.id;
    if (!window.confirm(`Delete "${category.name}"?`)) return;

    setLoadingRows((prev) => ({ ...prev, [id]: true }));
    try {
      await dispatch(deleteCategory(id)).unwrap();
      dispatch(getAllCategoris());
      dispatch(getAllDocs(buildDocumentParams(documentsPage)));
    } catch (err) {
      alert(err?.message || 'Failed to delete category');
    } finally {
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
      setActiveMenuId(null);
    }
  };

  return (
    <div className="turath-admin-table-page">
      <PageHeader
        title="Digital Library"
        subtitle="Manage heritage documents and categories"
        action={
          <div style={styles.pageActions}>
            <button
              onClick={() => setShowStoreCategory(true)}
              style={styles.btnSecondary}
            >
              Add Category
            </button>
            <button
              onClick={() => setShowStore(true)}
              style={styles.btnPrimary}
            >
              Add Document
            </button>
          </div>
        }
      />

      <div
        className="admin-filter-row"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div className="filter-chips" style={{ display: 'flex', gap: '0.5rem' }}>
          {['documents', 'categories'].map((tab) => (
            <button
              key={tab}
              className={`filter-chip ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setActiveMenuId(null);
              }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 500,
                backgroundColor:
                  activeTab === tab ? 'var(--primary)' : 'var(--surface-high)',
                color:
                  activeTab === tab ? 'white' : 'var(--on-surface-muted)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'documents' ? (
          <div style={styles.filterActions}>
            <div className="admin-search-pill" style={styles.searchPill}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--tertiary)' }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setDocumentsPage(1);
                }}
                style={styles.searchInput}
              />
            </div>
            <select
              className="admin-filter-select"
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setDocumentsPage(1);
              }}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category._id || category.id} value={category._id || category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {(search || categoryFilter) && (
              <button
                className="admin-clear-filter"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('');
                  setDocumentsPage(1);
                }}
              >
                Clear
              </button>
            )}
          </div>
        ) : (
          <div className="admin-result-count">{categories.length} Categories</div>
        )}
      </div>

      <div className="admin-table-shell">
        {activeTab === 'documents' ? (
          <DocumentsTable
            data={documents}
            pagination={documentsPagination}
            loading={documentsLoading}
            onPageChange={setDocumentsPage}
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
        ) : (
          <CategoriesTable
            data={categories}
            loading={categoriesLoading}
            loadingRows={loadingRows}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            onUpdate={(category) => {
              setSelectedCategory(category);
              setShowUpdateCategory(true);
              setActiveMenuId(null);
            }}
            onDelete={handleDeleteCategory}
          />
        )}
      </div>

      {showStore && (
        <Modal
          onClose={() => {
            setShowStore(false);
            fetchData(true);
          }}
        >
          <StoreDocument
            setShowStore={(value) => {
              setShowStore(value);
              if (!value) fetchData(true);
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
          <ShowDocumentDetailes
            doc={selectedDoc}
            onClose={() => {
              setShowDetails(false);
              setSelectedDoc(null);
            }}
            onEdit={(doc) => {
              setShowDetails(false);
              setSelectedDoc(doc);
              setShowUpdate(true);
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
          <UpdateDocument
            document={selectedDoc}
            setShowUpdate={(value) => {
              setShowUpdate(value);
              setSelectedDoc(null);
              if (!value) fetchData(true);
            }}
          />
        </Modal>
      )}

      {showStoreCategory && (
        <Modal
          onClose={() => {
            setShowStoreCategory(false);
            fetchData(true);
          }}
        >
          <StoreCategories
            setShowStore={(value) => {
              setShowStoreCategory(value);
              if (!value) fetchData(true);
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
          <UpdateCategorie
            categorie={selectedCategory}
            setShowUpdate={(value) => {
              setShowUpdateCategory(value);
              setSelectedCategory(null);
              if (!value) fetchData(true);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

const Modal = ({ children, onClose }) => (
  <div style={styles.modalOverlay} onClick={onClose}>
    <div style={styles.modalContent} onClick={(event) => event.stopPropagation()}>
      {children}
    </div>
  </div>
);

const DocumentsTable = ({
  data,
  pagination,
  loading,
  onPageChange,
  loadingRows,
  activeMenuId,
  setActiveMenuId,
  onDetails,
  onUpdate,
  onDelete,
}) => (
  <>
    <table className="admin-data-table" style={styles.table}>
      <thead>
        <tr>
          <th>Document</th>
          <th>Category</th>
          <th data-admin-actions></th>
        </tr>
      </thead>
      <tbody>
        {data.map((doc) => {
          const id = doc._id || doc.id;
          const isFromOpenLibrary = !!doc.open_library_key;
          const sourceLabel = documentSourceLabel(doc);

          return (
            <tr key={id}>
              <td data-label="Document">
                <div className="admin-row-main">
                  <div style={styles.docIcon}>DOC</div>
                  <div>
                    <div className="admin-row-title">{doc.title}</div>
                    <div className="admin-row-subtitle">{formatAuthors(doc.authors)}</div>
                    {sourceLabel && (
                      <span style={styles.openLibBadge}>{sourceLabel}</span>
                    )}
                  </div>
                </div>
              </td>
              <td data-label="Category">
                <span style={styles.badge}>
                  {doc.categorie?.name || '---'}
                </span>
              </td>
              <td data-label="Actions" style={{ position: 'relative' }}>
                <button
                  className="action-btn"
                  disabled={!!loadingRows[id]}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveMenuId(activeMenuId === id ? null : id);
                  }}
                  style={styles.menuBtn}
                >
                  {loadingRows[id] ? <Spinner /> : <MenuDots />}
                </button>
                {activeMenuId === id && (
                  <div className="admin-action-menu">
                    <DropdownItem onClick={() => onDetails(doc)}>
                      View Details
                    </DropdownItem>
                    {!isFromOpenLibrary && (
                      <>
                        <DropdownItem onClick={() => onUpdate(doc)}>
                          Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => onDelete(doc)} danger>
                          Delete
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
    {!loading && data.length === 0 && (
      <div className="admin-table-empty">No documents found.</div>
    )}
    <PaginationControls
      pagination={pagination}
      onPageChange={onPageChange}
      loading={loading}
    />
  </>
);

const CategoriesTable = ({
  data,
  loading,
  loadingRows,
  activeMenuId,
  setActiveMenuId,
  onUpdate,
  onDelete,
}) => (
  <>
    <table className="admin-data-table" style={styles.table}>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Slug</th>
          <th>Import</th>
          <th data-admin-actions></th>
        </tr>
      </thead>
      <tbody>
        {data.map((category) => {
          const id = category._id || category.id;
          const banner = resolveAssetUrl(category.banner);

          return (
            <tr key={id}>
              <td data-label="Image">
                {banner ? (
                  <img src={banner} alt="" style={styles.categoryThumb} />
                ) : (
                  <span style={styles.emptyThumb}>No image</span>
                )}
              </td>
              <td data-label="Name">
                <div className="admin-row-title">{category.name}</div>
              </td>
              <td data-label="Slug" className="admin-cell-muted">
                {category.slug}
              </td>
              <td data-label="Import">
                <ImportStatus category={category} />
              </td>
              <td data-label="Actions" style={{ position: 'relative' }}>
                <button
                  className="action-btn"
                  disabled={!!loadingRows[id]}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveMenuId(activeMenuId === id ? null : id);
                  }}
                  style={styles.menuBtn}
                >
                  {loadingRows[id] ? <Spinner /> : <MenuDots />}
                </button>
                {activeMenuId === id && (
                  <div className="admin-action-menu">
                    <DropdownItem onClick={() => onUpdate(category)}>
                      Edit
                    </DropdownItem>
                    <DropdownItem onClick={() => onDelete(category)} danger>
                      Delete
                    </DropdownItem>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    {!loading && data.length === 0 && (
      <div className="admin-table-empty">No categories found.</div>
    )}
  </>
);

const ImportStatus = ({ category }) => {
  const status = category.import_status;

  if (!status) {
    return <span className="admin-cell-muted">Not started</span>;
  }

  const summary = category.import_summary || {};
  const count = Number(summary.created || 0) + Number(summary.updated || 0);
  const label = status === 'queued'
    ? 'Queued'
    : status === 'importing'
      ? 'Importing'
      : status === 'completed'
        ? 'Finished'
        : 'Failed';

  return (
    <div style={styles.importStatusWrap}>
      <span style={{
        ...styles.importStatusBadge,
        ...(status === 'completed' ? styles.importStatusDone : {}),
        ...(status === 'failed' ? styles.importStatusFailed : {}),
      }}>
        {label}
      </span>
      {status === 'completed' && (
        <small style={styles.importStatusMeta}>{count} matched</small>
      )}
      {status === 'failed' && category.import_message && (
        <small style={styles.importStatusMeta}>{category.import_message}</small>
      )}
    </div>
  );
};

const DropdownItem = ({ children, onClick, danger }) => (
  <button onClick={onClick} className={danger ? 'is-danger' : undefined}>
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

const MenuDots = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="5" r="1.2" />
    <circle cx="12" cy="12" r="1.2" />
    <circle cx="12" cy="19" r="1.2" />
  </svg>
);

const styles = {
  pageActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  btnPrimary: {
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
  },
  btnSecondary: {
    background: 'var(--surface-high)',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '0.375rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'var(--on-surface)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  filterActions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.75rem',
  },
  searchPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--surface-high)',
    borderRadius: '9999px',
    padding: '0.25rem 1rem',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '0.5rem 0',
    fontSize: '0.85rem',
    width: '200px',
  },
  table: {
    width: '100%',
    minWidth: '700px',
    borderCollapse: 'collapse',
  },
  docIcon: {
    width: '36px',
    height: '36px',
    flex: '0 0 auto',
    borderRadius: '0.5rem',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.64rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
  },
  openLibBadge: {
    display: 'inline-block',
    marginTop: '0.24rem',
    padding: '0.1rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.65rem',
    backgroundColor: 'rgba(0,78,138,0.08)',
    color: 'var(--primary)',
    fontWeight: 600,
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    backgroundColor: 'rgba(99,70,29,0.08)',
    color: 'var(--tertiary)',
    fontWeight: 600,
  },
  categoryThumb: {
    width: '58px',
    height: '42px',
    borderRadius: '0.45rem',
    objectFit: 'cover',
    display: 'block',
  },
  emptyThumb: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '58px',
    minHeight: '42px',
    borderRadius: '0.45rem',
    background: 'var(--surface-low)',
    color: 'var(--on-surface-muted)',
    fontSize: '0.68rem',
    fontWeight: 600,
  },
  importStatusWrap: {
    display: 'inline-flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '0.22rem',
  },
  importStatusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '24px',
    padding: '0 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(0,78,138,0.08)',
    color: 'var(--primary)',
    fontSize: '0.68rem',
    fontWeight: 700,
  },
  importStatusDone: {
    background: 'rgba(46,125,79,0.1)',
    color: '#2e7d4f',
  },
  importStatusFailed: {
    background: 'rgba(159,64,45,0.1)',
    color: 'var(--secondary)',
  },
  importStatusMeta: {
    color: 'var(--on-surface-muted)',
    fontSize: '0.68rem',
    lineHeight: 1.35,
    maxWidth: '160px',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    padding: 0,
    borderRadius: '0.375rem',
    color: 'var(--on-surface-muted)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    overflowY: 'auto',
    zIndex: 1000,
  },
  modalContent: {
    background: 'var(--surface-white)',
    borderRadius: '1rem',
    width: 'min(90vw, 650px)',
    maxWidth: '650px',
    maxHeight: '85vh',
    overflow: 'auto',
    boxShadow: 'var(--shadow-lift)',
  },
};

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMedia,
  deleteMedia,
  updateMediaStatus,
} from '../../../app/services/reduxTollkit/asyncThunks/MediaThunk';
import PageHeader from '../../../components/admin/PageHeader';
import StatusBadge from '../../../components/admin/StatusBadge';
import CuratorAvatar from '../../../components/admin/CuratorAvatar';
import AdminLoading from '../../../components/admin/AdminLoading';
import StoreMedia from './StoreMedia';
import UpdateMedia from './UpdateMedia';
import ShowMediaDetails from './ShowMediaDetails';

const TYPES = ['All', 'Image', 'Audio', 'Video'];

const TYPE_ICONS = {
  Image: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Audio: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Video: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
};

export default function MediaLibrary() {
  const dispatch = useDispatch();
  const { media = [], loading } = useSelector((state) => state.media);
  const [showStore, setShowStore] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loadingRows, setLoadingRows] = useState({});
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    fetchMediaData();
  }, []);

  const fetchMediaData = (forceRefresh = false) => {
    if (!forceRefresh && media?.length) return;
    dispatch(fetchMedia());
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.closest('.action-btn')) return;
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleShowDetails = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setShowDetails(true);
    setActiveMenuId(null);
  };

  const handleUpdateMedia = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setShowUpdate(true);
    setActiveMenuId(null);
  };

  const handleDeleteMedia = async (mediaItem) => {
    const mediaId = mediaItem._id || mediaItem.id;
    if (window.confirm(`Delete "${mediaItem.title}"?`)) {
      setLoadingRows((prev) => ({ ...prev, [mediaId]: 'deleting' }));
      try {
        await dispatch(deleteMedia(mediaId));
        setActiveMenuId(null);
      } catch (err) {
        alert('Delete failed: ' + (err.message || 'Unknown error'));
      } finally {
        setLoadingRows((prev) => ({ ...prev, [mediaId]: false }));
      }
    }
  };

  const handleStatusChange = async (mediaItem, newStatus) => {
    const mediaId = mediaItem._id || mediaItem.id;
    setLoadingRows((prev) => ({ ...prev, [mediaId]: 'updating' }));
    try {
      await dispatch(updateMediaStatus({ id: mediaId, status: newStatus }));
      setActiveMenuId(null);
    } catch (err) {
      alert('Status update failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingRows((prev) => ({ ...prev, [mediaId]: false }));
    }
  };

  const handleBackgroundUpdate = async (mediaId, updatedData) => {
    setLoadingRows((prev) => ({ ...prev, [mediaId]: 'updating' }));
    try {
      await dispatch(updateMedia({ id: mediaId, data: updatedData }));
      setShowUpdate(false);
      setSelectedMedia(null);
      fetchMediaData(true);
    } catch (err) {
      throw err;
    } finally {
      setLoadingRows((prev) => ({ ...prev, [mediaId]: false }));
    }
  };

  const handleStoreClose = () => {
    setShowStore(false);
    fetchMediaData(true);
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedMedia(null);
  };

  const filteredMedia = (media || []).filter((item) => {
    const matchType = activeType === 'All' || item.type === activeType;
    const matchSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.curator?.toLowerCase().includes(search.toLowerCase()) ||
      item.format?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <>
      <PageHeader
        title="Media Library"
        subtitle="Images, audio recordings and video assets of Moroccan heritage."
        action={
          <button
            onClick={() => setShowStore(true)}
            className="btn-add-doc"
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
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Upload Asset
          </button>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : (
        <>
          {/* Filter Bar */}
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
            <div
              className="filter-chips"
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              {TYPES.map((t) => (
                <button
                  key={t}
                  className={`filter-chip ${activeType === t ? 'active' : ''}`}
                  onClick={() => setActiveType(t)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    backgroundColor:
                      activeType === t
                        ? 'var(--primary)'
                        : 'var(--surface-high)',
                    color:
                      activeType === t ? 'white' : 'var(--on-surface-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {t}
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                style={{ color: 'var(--tertiary)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search media…"
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

          {/* Table Container */}
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">{filteredMedia.length} Assets</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="content-table" style={{ minWidth: '900px' }}>
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
                  {filteredMedia.map((item) => {
                    const id = item._id || item.id;
                    return (
                      <tr key={id}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{item.title}</div>
                          {item.tags && item.tags.length > 0 && (
                            <div
                              style={{
                                fontSize: '0.72rem',
                                color: 'var(--on-surface-muted)',
                              }}
                            >
                              {item.tags.join(' · ')}
                            </div>
                          )}
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              color: 'var(--primary)',
                            }}
                          >
                            {TYPE_ICONS[item.type]}
                            <span style={{ fontSize: '0.78rem' }}>
                              {item.type}
                            </span>
                          </div>
                        </td>
                        <td className="date-text">
                          {item.format?.toUpperCase()}
                        </td>
                        <td className="date-text">
                          {item.resolution || 'N/A'}
                        </td>
                        <td className="date-text">
                          {formatFileSize(item.size)}
                        </td>
                        <td>
                          <CuratorAvatar
                            initials={
                              typeof item.curator === 'object'
                                ? item.curator.initials
                                : item.curator?.substring(0, 2).toUpperCase() ||
                                  '??'
                            }
                            name={
                              typeof item.curator === 'object'
                                ? item.curator.name
                                : item.curator || 'Unknown'
                            }
                          />
                        </td>
                        <td className="date-text">
                          {formatDate(item.date_added || item.created_at)}
                        </td>
                        <td>
                          <StatusBadge status={item.status || 'active'} />
                        </td>
                        <td style={{ position: 'relative' }}>
                          <button
                            className="action-btn"
                            disabled={!!loadingRows[id]}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === id ? null : id);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              width: '32px',
                              height: '32px',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {loadingRows[id] ? (
                              <div
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  border: '2px solid var(--primary)',
                                  borderTopColor: 'transparent',
                                  borderRadius: '50%',
                                  animation: 'spin 0.8s linear infinite',
                                }}
                              />
                            ) : (
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              >
                                <circle cx="12" cy="5" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="19" r="1.5" />
                              </svg>
                            )}
                          </button>
                          {activeMenuId === id && !loadingRows[id] && (
                            <div
                              style={{
                                position: 'absolute',
                                right: '0',
                                top: '40px',
                                backgroundColor: 'white',
                                borderRadius: '0.5rem',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                                minWidth: '140px',
                                zIndex: 20,
                                overflow: 'hidden',
                              }}
                            >
                              <button
                                onClick={() => handleShowDetails(item)}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '0.5rem 1rem',
                                  textAlign: 'left',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                👁️ View Details
                              </button>
                              <button
                                onClick={() => handleUpdateMedia(item)}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '0.5rem 1rem',
                                  textAlign: 'left',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                ✏️ Edit
                              </button>
                              {item.status !== 'archived' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(item, 'archived')
                                  }
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '0.5rem 1rem',
                                    textAlign: 'left',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                  }}
                                >
                                  📦 Archive
                                </button>
                              )}
                              {item.status === 'archived' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(item, 'active')
                                  }
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '0.5rem 1rem',
                                    textAlign: 'left',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                  }}
                                >
                                  🔄 Restore
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteMedia(item)}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '0.5rem 1rem',
                                  textAlign: 'left',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'var(--secondary)',
                                }}
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
              {filteredMedia.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'var(--on-surface-muted)',
                  }}
                >
                  No media assets found
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showStore && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'var(--surface-white)',
              borderRadius: '1rem',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: 'var(--shadow-lift)',
            }}
          >
            <StoreMedia setShowStore={handleStoreClose} />
          </div>
        </div>
      )}

      {showUpdate && selectedMedia && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'var(--surface-white)',
              borderRadius: '1rem',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: 'var(--shadow-lift)',
            }}
          >
            <UpdateMedia
              setShowUpdate={setShowUpdate}
              media={selectedMedia}
              onUpdate={handleBackgroundUpdate}
            />
          </div>
        </div>
      )}

      {showDetails && selectedMedia && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'var(--surface-white)',
              borderRadius: '1rem',
              width: '90%',
              maxWidth: '900px',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: 'var(--shadow-lift)',
            }}
          >
            <ShowMediaDetails
              media={selectedMedia}
              onClose={handleDetailsClose}
            />
          </div>
        </div>
      )}

      {/* Inject keyframe animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .action-btn:hover {
            background: var(--surface-low);
          }
        `}
      </style>
    </>
  );
}

// src/pages/admin/userManagement/Users.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUser,
  getAllusers,
  updateUser,
} from '../../../app/services/reduxTollkit/asyncThunks/UserThunk';
import PageHeader from '../../../components/admin/PageHeader';
import StatusBadge from '../../../components/admin/StatusBadge';
import AdminLoading from '../../../components/admin/AdminLoading';
import UpdateUser from './UpdateUser';
import StoreUser from './StoreUser';
import ShowUserDetails from './ShowUserDetails';

const ROLES = ['All', 'Admin', 'User'];

export default function Users() {
  const dispatch = useDispatch();
  const { users = [], loading } = useSelector((state) => state.users);
  const [showStore, setShowStore] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userTransform, setUserTransform] = useState(null);
  const [loadingRows, setLoadingRows] = useState({});
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState(null);

useEffect(() => {
  fetchUsers(); 
}, []); 

const fetchUsers = (forceRefresh = false) => {
  if (!forceRefresh && users?.length) return;
  dispatch(getAllusers());
};

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.closest('.action-btn')) return;
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const handleShowDetails = (user) => {
    setUserTransform(user);
    setShowDetails(true);
    setActiveMenuId(null);
  };
  const handleUpdateUser = (user) => {
    setUserTransform(user);
    setShowUpdate(true);
    setActiveMenuId(null);
  };
  const handleDeleteUser = async (user) => {
    const userId = user._id || user.id;
    if (window.confirm(`Delete ${user.name}?`)) {
      setLoadingRows((prev) => ({ ...prev, [userId]: 'deleting' }));
      try {
        await dispatch(deleteUser(userId));
        setActiveMenuId(null);
      } catch (err) {
        alert('Delete failed');
      } finally {
        setLoadingRows((prev) => ({ ...prev, [userId]: false }));
      }
    }
  };
  const handleBackgroundUpdate = async (userId, updatedData) => {
    setLoadingRows((prev) => ({ ...prev, [userId]: 'updating' }));
    try {
      await dispatch(updateUser({ id: userId, data: updatedData }));
      setShowUpdate(false);
      setUserTransform(null);
    } catch (err) {
      throw err;
    } finally {
      setLoadingRows((prev) => ({ ...prev, [userId]: false }));
    }
  };
  const handleStoreClose = () => setShowStore(false);
  const handleDetailsClose = () => {
    setShowDetails(false);
    setUserTransform(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = activeRole === 'All' || u.role?.toLowerCase() === activeRole.toLowerCase();
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.userName?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="turath-user-management">
      <PageHeader
        title="User Management"
        subtitle="Manage curators, admins and viewer access to the archive."
        action={
          <button
            onClick={() => setShowStore(true)}
            className="btn-add-user"
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
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add User
          </button>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : (
        <>
          {/* Filter Bar - using flex with gap */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRole(r)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    backgroundColor: activeRole === r ? 'var(--primary)' : 'var(--surface-high)',
                    color: activeRole === r ? 'white' : 'var(--on-surface-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--surface-high)', borderRadius: '9999px', padding: '0.25rem 1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--tertiary)' }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', padding: '0.5rem 0', fontSize: '0.85rem', width: '200px' }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div style={{ backgroundColor: 'var(--surface-white)', borderRadius: '1rem', boxShadow: 'var(--shadow-lift)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead style={{ backgroundColor: 'var(--surface-low)' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-muted)' }}>User</th>
                  <th style={{ padding: '1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-muted)' }}>Role</th>
                  <th style={{ padding: '1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-muted)' }}>Email</th>
                  <th style={{ padding: '1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-muted)' }}>Last Login</th>
                  <th style={{ padding: '1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-muted)' }}>Joined</th>
                  <th style={{ padding: '1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-muted)' }}>Status</th>
                  <th style={{ padding: '1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-muted)' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const id = user._id || user.id;
                  return (
                    <tr key={id} style={{ borderTop: '1px solid var(--surface-low)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-container))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{user.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-muted)' }}>@{user.userName}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: user.role?.toLowerCase() === 'admin' ? 'rgba(0,78,138,0.1)' : 'rgba(99,70,29,0.1)',
                          color: user.role?.toLowerCase() === 'admin' ? 'var(--primary)' : 'var(--tertiary)',
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--on-surface-muted)' }}>{user.email}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--on-surface-muted)' }}>{formatDate(user.last_login)}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--on-surface-muted)' }}>{formatDate(user.created_at)}</td>
                      <td style={{ padding: '1rem' }}><StatusBadge status={user.confirmed ? 'Active' : 'Pending'} /></td>
                      <td style={{ padding: '1rem', position: 'relative' }}>
                        <button
                          className="action-btn"
                          disabled={!!loadingRows[id]}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === id ? null : id);
                          }}
                          style={{ background: 'none', border: 'none', width: '32px', height: '32px', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {loadingRows[id] ? (
                            <div style={{ width: '16px', height: '16px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <circle cx="12" cy="5" r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="12" cy="19" r="1.5" />
                            </svg>
                          )}
                        </button>
                        {activeMenuId === id && !loadingRows[id] && (
                          <div style={{
                            position: 'absolute',
                            right: '0',
                            top: '40px',
                            backgroundColor: 'white',
                            borderRadius: '0.5rem',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                            minWidth: '140px',
                            zIndex: 20,
                            overflow: 'hidden',
                          }}>
                            <button onClick={() => handleShowDetails(user)} style={{ display: 'block', width: '100%', padding: '0.5rem 1rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>👤 View Details</button>
                            <button onClick={() => handleUpdateUser(user)} style={{ display: 'block', width: '100%', padding: '0.5rem 1rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>✏️ Edit</button>
                            <button onClick={() => handleDeleteUser(user)} style={{ display: 'block', width: '100%', padding: '0.5rem 1rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)' }}>🗑️ Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modals - ensure they don't inherit old modal styles */}
      {showStore && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface-white)', borderRadius: '1rem', width: '90%', maxWidth: '600px', maxHeight: '85vh', overflow: 'auto', boxShadow: 'var(--shadow-lift)' }}>
            <StoreUser setShowStore={handleStoreClose} />
          </div>
        </div>
      )}

      {showUpdate && userTransform && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface-white)', borderRadius: '1rem', width: '90%', maxWidth: '800px', maxHeight: '85vh', overflow: 'auto', boxShadow: 'var(--shadow-lift)' }}>
            <UpdateUser setShowUpdate={setShowUpdate} user={userTransform} onUpdate={handleBackgroundUpdate} />
          </div>
        </div>
      )}

      {showDetails && userTransform && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface-white)', borderRadius: '1rem', width: '90%', maxWidth: '900px', maxHeight: '85vh', overflow: 'auto', boxShadow: 'var(--shadow-lift)' }}>
            <ShowUserDetails user={userTransform} onClose={handleDetailsClose} />
          </div>
        </div>
      )}

      {/* Inject keyframe animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .turath-user-management .action-btn:hover {
          background: var(--surface-low);
        }
      `}</style>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/admin/PageHeader';
import StatusBadge from '../../../components/admin/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUser,
  getAllusers,
  updateUser,
} from '../../../app/services/reduxTollkit/asyncThunks/UserThunk';
import AdminLoading from '../../../components/admin/AdminLoading';
import { Link, useNavigate } from 'react-router-dom';
import UpdateUser from './UpdateUser';
import StoreUser from './StoreUser';
import ShowUserDetails from './ShowUserDetailes';

const ROLES = ['All', 'Admin', 'user'];

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [], loading } = useSelector((state) => state.users);
  const [showStore, setShowStore] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userTransform, setUserTransform] = useState(null);
  const [loadingRows, setLoadingRows] = useState({});

  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      await dispatch(getAllusers());
    } catch (error) {
      console.log(error);
    }
  };

  // Handle clicking outside of open menus to close them automatically
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Action Menu Handlers
  const handleShowDetails = (user) => {
    setUserTransform(user);
    setShowDetails(true);
  };

  const handleUpdateUser = (user) => {
    setUserTransform(user);
    setShowUpdate(true);
  };

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );
    if (confirmDelete) {
      // Set loading state for this specific row
      setLoadingRows((prev) => ({ ...prev, [user.id]: 'deleting' }));
      try {
        await dispatch(deleteUser(user.id));
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete user. Please try again.');
      } finally {
        setLoadingRows((prev) => ({ ...prev, [user.id]: false }));
      }
    }
  };

  // Background update function passed to child component
  const handleBackgroundUpdate = async (userId, updatedData) => {
    setLoadingRows((prev) => ({ ...prev, [userId]: 'updating' }));
    try {
      const result = await dispatch(
        updateUser({ id: userId, data: updatedData })
      );

      // Close the modal
      setShowUpdate(false);
      setUserTransform(null);

      return result;
    } catch (error) {
      console.error('Update failed:', error);
      throw error;
    } finally {
      setLoadingRows((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Handle store user close and refresh
  const handleStoreClose = async (shouldRefresh = true) => {
    setShowStore(false);
    if (shouldRefresh) {
      await fetchUsers();
    }
  };

  // Handle details close
  const handleDetailsClose = () => {
    setShowDetails(false);
    setUserTransform(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole =
      activeRole === 'All' ||
      u.role?.toLowerCase() === activeRole.toLowerCase();

    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Manage curators, admins and viewer access to the archive."
        action={
          <button onClick={() => setShowStore(true)} className="btn-add-doc">
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
            add User
          </button>
        }
      />

      {loading ? (
        <AdminLoading />
      ) : (
        <>
          <div className="filter-bar">
            <div className="filter-chips">
              {ROLES.map((r) => (
                <button
                  key={r}
                  className={`filter-chip ${activeRole === r ? 'active' : ''}`}
                  onClick={() => setActiveRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="filter-search">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">{filteredUsers.length} Users</h2>
            </div>
            <table className="content-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Last Login</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={loadingRows[user.id] ? 'row-loading' : ''}
                  >
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <div className="curator-avatar">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 500,
                              textTransform: 'capitalize',
                            }}
                          >
                            {user.name}
                          </div>
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--on-surface-muted)',
                            }}
                          >
                            @{user.userName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`chip ${
                          user.role === 'Admin' || user.role === 'admin'
                            ? 'chip-manuscript'
                            : 'chip-media'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="date-text">{user.email}</td>
                    <td className="date-text">{formatDate(user.last_login)}</td>
                    <td className="date-text">{formatDate(user.created_at)}</td>
                    <td>
                      <StatusBadge
                        status={user.confirmed ? 'Active' : 'Pending'}
                      />
                    </td>

                    {/* Actions Column */}
                    <td style={{ position: 'relative' }}>
                      <button
                        className="action-btn"
                        disabled={!!loadingRows[user.id]}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === user.id ? null : user.id
                          );
                        }}
                      >
                        {loadingRows[user.id] ? (
                          <div className="loading-spinner-small"></div>
                        ) : (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        )}
                      </button>

                      {/* Context Action Dropdown Layer */}
                      {activeMenuId === user.id && !loadingRows[user.id] && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '40px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 100,
                            minWidth: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '4px 0',
                          }}
                        >
                          <button
                            onClick={() => handleShowDetails(user)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '8px 12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                            }}
                          >
                            Show Details
                          </button>
                          <button
                            onClick={() => handleUpdateUser(user)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '8px 12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                            }}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '8px 12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              color: 'red',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Store Modal */}
      {showStore && (
        <div className="modal-overlay">
          <div className="modal-content">
            <StoreUser setShowStore={handleStoreClose} />
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdate && userTransform && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UpdateUser
              setShowUpdate={setShowUpdate}
              user={userTransform}
              onUpdate={handleBackgroundUpdate}
            />
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && userTransform && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ShowUserDetails
              user={userTransform}
              onClose={handleDetailsClose}
            />
          </div>
        </div>
      )}
    </>
  );
}

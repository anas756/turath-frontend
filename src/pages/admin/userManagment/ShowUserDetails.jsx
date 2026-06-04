import React from 'react';
import StatusBadge from '../../../components/admin/StatusBadge';

export default function ShowUserDetails({ user, onClose }) {
  if (!user) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isAdmin = user.role?.toLowerCase() === 'admin';


  const styles = {
    card: {
      backgroundColor: '#e8e2d7', // Warm gray 200 – darker than cream, still heritage
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 20px 35px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
    },
    header: {
      background: 'linear-gradient(135deg, #d2c8b9 0%, #e8e2d7 100%)', // darker gradient
      padding: '1.5rem 2rem',
      borderBottom: '1px solid #c4b8a8',
    },
    headerInner: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    avatarSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
    },
    avatar: {
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      fontFamily: 'var(--serif)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    name: {
      fontFamily: 'var(--serif)',
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#2c2a24', // darker ink for better contrast on warm bg
      margin: 0,
      textTransform: 'capitalize',
    },
    username: {
      color: '#5a4e3e',
      marginTop: '0.25rem',
      fontSize: '0.85rem',
    },
    closeBtn: {
      background: '#d2c8b9',
      border: 'none',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4a3e2c',
      transition: 'background 0.2s',
    },
    body: {
      padding: '2rem',
      backgroundColor: '#e8e2d7',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
    },
    infoCard: {
      backgroundColor: '#f6f3ed', // slightly lighter than card bg for contrast
      borderRadius: '0.75rem',
      padding: '1.25rem',
      border: '1px solid #d2c8b9',
      boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.04)',
    },
    cardTitle: {
      fontFamily: 'var(--serif)',
      fontSize: '1rem',
      fontWeight: 600,
      color: '#2c2a24',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.6rem 0',
      borderBottom: '1px solid #d2c8b9',
    },
    lastRow: {
      borderBottom: 'none',
    },
    label: {
      color: '#6b5a48',
      fontSize: '0.8rem',
    },
    value: {
      fontWeight: 500,
      color: '#2c2a24',
      fontSize: '0.85rem',
      wordBreak: 'break-all',
      textAlign: 'right',
    },
    roleBadge: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.7rem',
      fontWeight: 600,
      backgroundColor: isAdmin ? 'rgba(0,78,138,0.15)' : 'rgba(99,70,29,0.15)',
      color: isAdmin ? 'var(--primary)' : 'var(--tertiary)',
    },
    verified: {
      color: '#2e7d32',
      fontWeight: 500,
    },
    unverified: {
      color: '#b1452e', // terracotta variation
    },
    bioCard: {
      marginTop: '1.5rem',
      backgroundColor: '#f6f3ed',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      border: '1px solid #d2c8b9',
    },
    bioText: {
      color: '#4a3e2c',
      lineHeight: 1.5,
      fontSize: '0.85rem',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>{getInitials(user.name)}</div>
            <div>
              <h2 style={styles.name}>{user.name}</h2>
              <p style={styles.username}>@{user.userName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={styles.closeBtn}
            onMouseEnter={(e) => e.currentTarget.style.background = '#c4b8a8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#d2c8b9'}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.grid}>
          <div style={styles.infoCard}>
            <div style={styles.cardTitle}>
              <span>📋</span> Account Information
            </div>
            <div>
              <div style={styles.row}>
                <span style={styles.label}>Email</span>
                <span style={styles.value}>{user.email}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Role</span>
                <span style={styles.value}>
                  <span style={styles.roleBadge}>{user.role}</span>
                </span>
              </div>
              <div style={{ ...styles.row, ...styles.lastRow }}>
                <span style={styles.label}>Status</span>
                <span style={styles.value}>
                  <StatusBadge status={user.confirmed ? 'Active' : 'Pending'} />
                </span>
              </div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.cardTitle}>
              <span>⏱️</span> Activity
            </div>
            <div>
              <div style={styles.row}>
                <span style={styles.label}>Joined</span>
                <span style={styles.value}>{formatDate(user.created_at)}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Last Login</span>
                <span style={styles.value}>{formatDate(user.last_login)}</span>
              </div>
              <div style={{ ...styles.row, ...styles.lastRow }}>
                <span style={styles.label}>Email Verified</span>
                <span style={styles.value}>
                  <span style={user.email_verified_at ? styles.verified : styles.unverified}>
                    {user.email_verified_at ? formatDate(user.email_verified_at) : 'Not verified'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {user.bio && (
          <div style={styles.bioCard}>
            <div style={styles.cardTitle}>
              <span>📝</span> Bio
            </div>
            <p style={styles.bioText}>{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
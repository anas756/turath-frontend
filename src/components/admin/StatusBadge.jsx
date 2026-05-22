import React from 'react';

const STYLES = {
  // document statuses
  Published:     { bg: '#eef5ee', color: '#2d7a4f' },
  Draft:         { bg: '#f5f0e8', color: '#63461d' },
  'Under Review':{ bg: '#e8f0f8', color: '#004e8a' },
  // user statuses
  Active:        { bg: '#eef5ee', color: '#2d7a4f' },
  Inactive:      { bg: '#f5f0e8', color: '#63461d' },
  Pending:       { bg: '#faeae7', color: '#9f402d' },
  // chat statuses
  Resolved:      { bg: '#eef5ee', color: '#2d7a4f' },
  Failed:        { bg: '#faeae7', color: '#9f402d' },
  // media
  Processing:    { bg: '#e8f0f8', color: '#004e8a' },
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || { bg: '#f0eee8', color: '#6b6b64' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: '99px',
      fontSize: '0.68rem',
      fontWeight: 600,
      background: style.bg,
      color: style.color,
    }}>
      {status}
    </span>
  );
}
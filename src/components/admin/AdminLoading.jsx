import React from 'react';
import '../../styles/admin.css';

export default function AdminLoading() {
  return (
    <div className="admin-loading-container">
      <div className="admin-loading-content">
        <div className="loading-spinner-small"></div>
        <p className="loading-text">LOADING...</p>
      </div>
    </div>
  );
}

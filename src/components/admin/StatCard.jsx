import React from 'react';

export default function StatCard({ label, value, meta, type }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className={`stat-meta ${type || ''}`}>{meta}</p>
    </div>
  );
}
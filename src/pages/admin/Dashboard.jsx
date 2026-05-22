import React from 'react';

const STATS = [
  {
    label: 'Total Users',
    value: '1,204',
    meta: '↑ +12% this month',
    type: 'positive',
  },
  {
    label: 'Archived Documents',
    value: '8,542',
    meta: '⊡ Fes Medina Collection',
    type: 'neutral',
  },
  {
    label: 'Media Assets',
    value: '2,190',
    meta: '⊡ Zellij Patterns',
    type: 'neutral',
  },
];

const DOCS = [
  {
    title: 'Al-Qarawiyyin Manuscript 042',
    category: 'Manuscript',
    categoryStyle: 'chip-manuscript',
    date: 'Oct 12, 2023',
    curator: 'Fatima B.',
    initials: 'FB',
    iconStyle: 'blue',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    title: 'Blue Zellige Master Pattern',
    category: 'Media',
    categoryStyle: 'chip-media',
    date: 'Oct 10, 2023',
    curator: 'Admin User',
    initials: 'AU',
    iconStyle: 'gold',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    title: 'Riad Courtyard Blueprint',
    category: 'Architecture',
    categoryStyle: 'chip-arch',
    date: 'Oct 08, 2023',
    curator: 'Youssef A.',
    initials: 'YA',
    iconStyle: 'terrac',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    ),
  },
];

export default function Dashboard() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Curator Overview</h1>
        <p className="page-subtitle">System status and recent architectural archive additions.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
            <p className={`stat-meta ${s.type}`}>{s.meta}</p>
          </div>
        ))}
      </div>

      {/* Recent content */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Recently Added Content</h2>
          <button className="btn-view-all">View All →</button>
        </div>

        <table className="content-table">
          <thead>
            <tr>
              <th>Document Title</th>
              <th>Category</th>
              <th>Date Added</th>
              <th>Curator</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {DOCS.map((doc) => (
              <tr key={doc.title}>
                <td>
                  <div className="doc-title-wrap">
                    <div className={`doc-icon ${doc.iconStyle}`}>{doc.icon}</div>
                    <span className="doc-title-text">{doc.title}</span>
                  </div>
                </td>
                <td><span className={`chip ${doc.categoryStyle}`}>{doc.category}</span></td>
                <td><span className="date-text">{doc.date}</span></td>
                <td>
                  <div className="curator-wrap">
                    <div className="curator-avatar">{doc.initials}</div>
                    {doc.curator}
                  </div>
                </td>
                <td>
                  <button className="action-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
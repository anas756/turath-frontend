import React from 'react';
import { chatLogs } from '../../data/admin/chatLogs';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';

export default function ChatLogs() {
  const logs = chatLogs;

  return (
    <div className="turath-admin-table-page">
      <PageHeader
        title="AI Chat Logs"
        subtitle="Review all AI assistant interactions with archive users."
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
          <button
            className="filter-chip active"
            type="button"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 500,
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              cursor: 'default',
            }}
          >
            All Logs
          </button>
        </div>
        <div className="admin-result-count">{logs.length} Interactions</div>
      </div>

      <div className="admin-table-shell">
        <table className="admin-data-table" style={{ minWidth: '900px' }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Query</th>
              <th>Response</th>
              <th>Tokens</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td data-label="User">
                  <div className="admin-row-main">
                    <div className="curator-avatar">{log.user.initials}</div>
                    <div>
                      <div className="admin-row-title">{log.user.name}</div>
                    </div>
                  </div>
                </td>
                <td data-label="Query">
                  <div className="admin-cell-clamp">{log.query}</div>
                </td>
                <td data-label="Response">
                  <div className="admin-cell-clamp">{log.response}</div>
                </td>
                <td data-label="Tokens" className="admin-cell-muted">
                  {log.tokens}
                </td>
                <td data-label="Timestamp" className="admin-cell-muted" style={{ whiteSpace: 'nowrap' }}>
                  {log.timestamp}
                </td>
                <td data-label="Status">
                  <StatusBadge status={log.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="admin-table-empty">No chat logs found.</div>
        )}
      </div>
    </div>
  );
}

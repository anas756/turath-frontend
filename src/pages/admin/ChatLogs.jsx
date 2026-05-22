import React from 'react';
import { chatLogs } from '../../data/admin/chatLogs';
// When dynamic: dispatch(fetchChatLogs())
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';

export default function ChatLogs() {
  // When dynamic: replace with Redux state
  const logs = chatLogs;

  return (
    <>
      <PageHeader
        title="AI Chat Logs"
        subtitle="Review all AI assistant interactions with archive users."
      />

      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">{logs.length} Interactions</h2>
        </div>
        <table className="content-table">
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
            {logs.map(log => (
              <tr key={log.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="curator-avatar">{log.user.initials}</div>
                    <span style={{ fontWeight: 500, fontSize: '0.82rem' }}>{log.user.name}</span>
                  </div>
                </td>
                <td style={{ maxWidth: 220 }}>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>{log.query}</div>
                </td>
                <td style={{ maxWidth: 240 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-muted)', lineHeight: 1.5 }}>{log.response}</div>
                </td>
                <td className="date-text">{log.tokens}</td>
                <td className="date-text" style={{ whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                <td><StatusBadge status={log.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
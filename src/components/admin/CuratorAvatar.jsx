import React from 'react';

export default function CuratorAvatar({ initials, name }) {
  return (
    <div className="curator-wrap">
      <div className="curator-avatar">{initials}</div>
      {name && <span>{name}</span>}
    </div>
  );
}
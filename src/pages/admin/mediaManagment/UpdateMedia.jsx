import React, { useState } from 'react';

const s = {
  header: {
    fontSize: '1.25rem',
    marginBottom: '1.5rem',
    color: '#1a1a1a',
    fontWeight: '700',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.25rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    fontSize: '0.95rem',
    width: '100%',
    outline: 'none',
    transition: 'border 0.2s',
  },
  fileDrop: {
    padding: '1.5rem',
    border: '2px dashed #e5e7eb',
    borderRadius: '0.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#f9fafb',
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  actions: { display: 'flex', gap: '1rem', marginTop: '2rem' },
  btnPrimary: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: 'var(--primary)',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default function UpdateMedia({ media, setShowUpdate, onUpdate }) {
  const [formData, setFormData] = useState({
    title: media.title || '',
    type: media.type || 'image',
    curator: media.curator || '',
    status: media.status || 'active',
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create a fresh FormData object
    const data = new FormData();

    // 2. Iterate over the state (formData)
    Object.entries(formData).forEach(([key, value]) => {
      // Only append if there is a value
      if (value !== null && value !== undefined && value !== '') {
        data.append(key, value);
      }
    });

   
    // This tells Laravel to treat this POST request as a PUT request
    data.append('_method', 'PUT');

    // 4. Trigger the update
    try {
      await onUpdate(media._id || media.id, data);
      setShowUpdate(false);
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update media. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h3 style={s.header}>Update Asset: {media.title}</h3>
      <form onSubmit={handleSubmit}>
        <div style={s.formGroup}>
          <label style={s.label}>Title</label>
          <input
            style={s.input}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Replace Media File</label>
          <input
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files[0] })
            }
            style={s.fileDrop}
          />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Status</label>
          <select
            style={s.input}
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
    
          </select>
        </div>

        <div style={s.actions}>
          <button
            type="button"
            style={s.btnSecondary}
            onClick={() => setShowUpdate(false)}
          >
            Cancel
          </button>
          <button type="submit" style={s.btnPrimary} disabled={loading}>
            {loading ? 'Processing...' : 'Update Asset'}
          </button>
        </div>
      </form>
    </div>
  );
}

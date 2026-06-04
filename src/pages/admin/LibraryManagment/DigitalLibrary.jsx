import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllDocs,
  getAllCategoris,
} from '../../../app/services/reduxTollkit/asyncThunks/LibraryThunk';
import PageHeader from '../../../components/admin/PageHeader';
import StatusBadge from '../../../components/admin/StatusBadge';
import CuratorAvatar from '../../../components/admin/CuratorAvatar';
import AdminLoading from '../../../components/admin/AdminLoading';

export default function DigitalLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const dispatch = useDispatch();
  const {
    documents = [],
    categories = [],
    loading = false,
  } = useSelector((state) => state.library || {});

  useEffect(() => {
    if (!documents.length) dispatch(getAllDocs());
    if (!categories.length) dispatch(getAllCategoris());
  }, [dispatch, documents.length, categories.length]);

  // Logic filtering
  const filtered = (documents || []).filter((doc) => {
    const matchesCategory =
      activeCategory === 'All' || doc.category?.name === activeCategory;
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHeader
        title="Digital Library"
        subtitle="Browse and manage all archived documents."
        action={
          <button
            className="btn-add-doc"
            onClick={() => {
              /* Open Add Document Modal */
            }}
          >
            Add Document
          </button>
        }
      />

      {/* Dynamic Filters */}
      <div className="filter-bar">
        <div className="filter-chips">
          <button
            className={`filter-chip ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              className={`filter-chip ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="filter-search">
          <input
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="section-card">
        {loading ? (
          <AdminLoading />
        ) : (
          <table className="content-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Language</th>
                <th>Curator</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.title}</td>
                  <td>
                    <span className="chip">{doc.category?.name}</span>
                  </td>
                  <td>{doc.language}</td>
                  <td>
                    <CuratorAvatar name={doc.curator?.name} />
                  </td>
                  <td>
                    <StatusBadge status={doc.status} />
                  </td>
                  <td>
                    <button className="action-btn">...</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

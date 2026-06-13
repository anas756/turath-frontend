import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../components/user/EmptyState';
import { api } from '../../app/services/lib/Api';

export default function UserDocumentReader() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [state, setState] = useState({
    loading: true,
    error: null,
    title: '',
    content: null,
    pagination: null,
  });

  useEffect(() => {
    let ignore = false;

    setState((current) => ({ ...current, loading: true, error: null }));

    Promise.all([
      api.getDoc(id),
      api.getDocContent(id, page),
    ])
      .then(([documentResponse, contentResponse]) => {
        if (ignore) return;
        const payload = contentResponse.data.data;
        setState({
          loading: false,
          error: null,
          title: documentResponse.data.data?.title || 'Document reader',
          content: payload?.data?.[0] || null,
          pagination: payload || null,
        });
      })
      .catch((error) => {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || 'Failed to load extracted text.',
            title: '',
            content: null,
            pagination: null,
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [id, page]);

  const lastPage = state.pagination?.last_page || 1;

  return (
    <section className="user-detail-page user-reader-page">
      <div className="user-detail-shell">
        <Link to={`/user/library/${id}`} className="user-back-link">Back to document</Link>

        <div className="user-reader-card">
          <div className="user-reader-header">
            <div>
              <p className="user-section-eyebrow">Reader</p>
              <h1>{state.title || 'Document reader'}</h1>
            </div>
            <div className="user-reader-controls">
              <button
                type="button"
                disabled={page <= 1 || state.loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </button>
              <span>Page {page} of {lastPage}</span>
              <button
                type="button"
                disabled={page >= lastPage || state.loading}
                onClick={() => setPage((current) => Math.min(lastPage, current + 1))}
              >
                Next
              </button>
            </div>
          </div>

          {state.loading ? (
            <EmptyState title="Loading page..." message="Fetching extracted content." />
          ) : state.error ? (
            <EmptyState title="Reader unavailable" message={state.error} />
          ) : state.content ? (
            <article className="user-reader-content">
              <pre>{state.content.content}</pre>
            </article>
          ) : (
            <EmptyState
              title="No extracted text yet"
              message="This document does not have readable content stored yet."
            />
          )}
        </div>
      </div>
    </section>
  );
}

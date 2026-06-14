import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import EmptyState from '../../components/user/EmptyState';
import { api } from '../../app/services/lib/Api';

export default function UserDocumentReader() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const [page, setPage] = useState(initialPage);
  const requestKey = `${id}:${page}`;
  const [state, setState] = useState({
    loading: true,
    error: null,
    title: '',
    content: null,
    pagination: null,
    availability: null,
    loadedKey: null,
  });

  useEffect(() => {
    let ignore = false;

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
          availability: contentResponse.data.meta || null,
          loadedKey: requestKey,
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
            availability: null,
            loadedKey: requestKey,
          });
        }
      });
    

    return () => {
      ignore = true;
    };
  }, [id, page, requestKey]);

  useEffect(() => {
    document
      .querySelector('.user-reader-content')
      ?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const lastPage = state.pagination?.last_page || 1;
  const isLoading = state.loading || state.loadedKey !== requestKey;
  const isPreviewOnly = state.availability?.is_open_library_preview_only ||
    state.content?.type === 'open_library_metadata';
  const previewMessage = state.availability?.message ||
    'Only Open Library preview metadata is available for this book. Full readable text was not provided by the source.';

  const goToPage = (nextPage) => {
    const safePage = Math.min(Math.max(1, nextPage), lastPage);
    setState((current) => ({ ...current, loading: true, error: null }));
    setPage(safePage);
    setSearchParams({ page: String(safePage) }, { replace: true });
  };

  return (
    <section className="user-detail-page user-reader-page">
      <div className="user-detail-shell">
        <Link to={`/user/library/${id}`} className="user-back-link">
          Back to document
        </Link>

        <div className="user-reader-card">
          <div className="user-reader-header">
            <div>
              <p className="user-section-eyebrow">Reader</p>
              <h1>{state.title || 'Document reader'}</h1>
            </div>
            <div className="user-reader-controls">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => goToPage(page - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {lastPage}
              </span>
              <button
                type="button"
                disabled={page >= lastPage || isLoading}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
          {/* Add this right after the closing div of user-reader-header */}
          <div className="user-reader-progress">
            <div
              className="user-reader-progress__fill"
              style={{ width: `${(page / lastPage) * 100}%` }}
            />
          </div>
          {!isLoading && isPreviewOnly && (
            <div className="user-reader-notice">
              <strong>Preview only</strong>
              <p>{previewMessage}</p>
            </div>
          )}
          {isLoading ? (
            <EmptyState
              title="Loading page..."
              message="Fetching extracted content."
            />
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

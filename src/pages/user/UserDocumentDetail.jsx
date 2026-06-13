import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import EmptyState from '../../components/user/EmptyState';
import SectionHeader from '../../components/user/SectionHeader';
import { api } from '../../app/services/lib/Api';
import { addDocumentFavorite, removeFavorite } from '../../app/services/reduxTollkit/asyncThunks/FavoriteThunk';
import useUserArchiveData from '../../hooks/useUserArchiveData';
import {
  getId,
  mapDocumentToResource,
  resolveAssetUrl,
} from '../../utils/userResources';

export default function UserDocumentDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { categories, isDocumentFavorite } = useUserArchiveData();
  const [state, setState] = useState({
    loading: true,
    error: null,
    document: null,
  });

  useEffect(() => {
    let ignore = false;

    setState({ loading: true, error: null, document: null });

    api.getDoc(id)
      .then(({ data }) => {
        if (!ignore) {
          setState({ loading: false, error: null, document: data.data });
        }
      })
      .catch((error) => {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || 'Failed to load this document.',
            document: null,
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const resource = useMemo(
    () => state.document ? mapDocumentToResource(state.document, categories) : null,
    [categories, state.document]
  );

  if (state.loading) {
    return (
      <section className="user-detail-page">
        <EmptyState title="Loading document..." message="Fetching the archive record." />
      </section>
    );
  }

  if (state.error || !resource) {
    return (
      <section className="user-detail-page">
        <EmptyState title="Document unavailable" message={state.error || 'This document could not be found.'} />
      </section>
    );
  }

  const saved = isDocumentFavorite(resource);
  const originalFile = resolveAssetUrl(state.document.file_path);

  const handleFavorite = () => {
    if (saved) {
      dispatch(removeFavorite({ type: 'document', favorableId: getId(resource) }));
    } else {
      dispatch(addDocumentFavorite(getId(resource)));
    }
  };

  return (
    <section className="user-detail-page">
      <div className="user-detail-shell">
        <Link to="/user/library" className="user-back-link">Back to library</Link>

        <article className="user-detail-hero-card">
          <div className="user-detail-cover">
            <img src={resource.thumbnail} alt="" />
          </div>
          <div className="user-detail-body">
            <p className="user-section-eyebrow">{resource.category}</p>
            <h1>{resource.title}</h1>
            {resource.authors && <p className="user-detail-author">{resource.authors}</p>}
            <p>{resource.description}</p>

            <div className="user-detail-meta">
              <span>{resource.type}</span>
              <span>{resource.format}</span>
              {state.document.source && <span>{state.document.source}</span>}
            </div>

            <div className="user-detail-actions">
              <Link to={`/user/library/${getId(resource)}/read`}>Read extracted text</Link>
              {originalFile && (
                <a href={originalFile} target="_blank" rel="noreferrer">
                  Open original file
                </a>
              )}
              <button type="button" onClick={handleFavorite}>
                {saved ? 'Remove from My Library' : 'Save to My Library'}
              </button>
            </div>
          </div>
        </article>

        <div className="user-page-block">
          <SectionHeader eyebrow="Archive Details" title="Record information" />
          <div className="user-detail-info-grid">
            <div>
              <span>Category</span>
              <strong>{resource.category}</strong>
            </div>
            <div>
              <span>Format</span>
              <strong>{resource.format}</strong>
            </div>
            <div>
              <span>Source</span>
              <strong>{state.document.source || 'Local archive'}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

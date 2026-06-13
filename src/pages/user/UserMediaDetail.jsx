import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import RichText from '../../components/common/RichText';
import EmptyState from '../../components/user/EmptyState';
import { api } from '../../app/services/lib/Api';
import { addMediaFavorite, removeFavorite } from '../../app/services/reduxTollkit/asyncThunks/FavoriteThunk';
import useUserArchiveData from '../../hooks/useUserArchiveData';
import {
  formatFileSize,
  getId,
  mapMediaToResource,
} from '../../utils/userResources';

function MediaPlayer({ resource }) {
  if (resource.isVideo && resource.mediaUrl) {
    return <video src={resource.mediaUrl} controls playsInline preload="metadata" />;
  }

  if (resource.isAudio && resource.mediaUrl) {
    return <audio src={resource.mediaUrl} controls preload="metadata" />;
  }

  if (resource.mediaUrl && resource.type === 'Image') {
    return <img src={resource.mediaUrl} alt="" />;
  }

  return <img src={resource.thumbnail} alt="" />;
}

export default function UserMediaDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isMediaFavorite } = useUserArchiveData();
  const [state, setState] = useState({
    loading: true,
    error: null,
    media: null,
  });

  useEffect(() => {
    let ignore = false;

    setState({ loading: true, error: null, media: null });

    api.getMediaById(id)
      .then(({ data }) => {
        if (!ignore) {
          setState({ loading: false, error: null, media: data.data });
        }
      })
      .catch((error) => {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || 'Failed to load this media item.',
            media: null,
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const resource = useMemo(
    () => state.media ? mapMediaToResource(state.media) : null,
    [state.media]
  );

  if (state.loading) {
    return (
      <section className="user-detail-page">
        <EmptyState title="Loading media..." message="Fetching the archive record." />
      </section>
    );
  }

  if (state.error || !resource) {
    return (
      <section className="user-detail-page">
        <EmptyState title="Media unavailable" message={state.error || 'This media item could not be found.'} />
      </section>
    );
  }

  const saved = isMediaFavorite(resource);
  const handleFavorite = () => {
    if (saved) {
      dispatch(removeFavorite({ type: 'media', favorableId: getId(resource) }));
    } else {
      dispatch(addMediaFavorite(getId(resource)));
    }
  };

  return (
    <section className="user-detail-page">
      <div className="user-detail-shell">
        <Link to="/user/media" className="user-back-link">Back to media</Link>

        <article className="user-media-detail">
          <div className="user-media-player">
            <MediaPlayer resource={resource} />
          </div>

          <div className="user-detail-body">
            <p className="user-section-eyebrow">{resource.type}</p>
            <h1>{resource.title}</h1>
            <RichText
              html={state.media.description || resource.description}
              className="rich-text rich-text--user-detail"
            />

            <div className="user-detail-meta">
              <span>{resource.format}</span>
              {state.media.resolution && <span>{state.media.resolution}</span>}
              {state.media.size && <span>{formatFileSize(state.media.size)}</span>}
              {state.media.curator && <span>{state.media.curator}</span>}
            </div>

            <div className="user-detail-actions">
              {resource.mediaUrl && (
                <a href={resource.mediaUrl} target="_blank" rel="noreferrer">
                  Open original media
                </a>
              )}
              <button type="button" onClick={handleFavorite}>
                {saved ? 'Remove from My Library' : 'Save to My Library'}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

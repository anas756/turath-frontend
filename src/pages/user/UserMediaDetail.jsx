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

function isVideoFile(file) {
  return file?.type?.toString().toLowerCase() === 'video' || file?.mime_type?.startsWith('video/');
}

function MediaPlayer({ file, resource }) {
  const fileUrl = file?.url || resource.mediaUrl;
  const isVideo = file ? isVideoFile(file) : resource.isVideo;

  if (isVideo && fileUrl) {
    return <video src={fileUrl} controls playsInline preload="metadata" />;
  }

  if (fileUrl) {
    return <img src={fileUrl} alt="" />;
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
  const [selectedFileId, setSelectedFileId] = useState(null);

  useEffect(() => {
    let ignore = false;

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
  const files = resource?.files?.length ? resource.files : [];
  const selectedFile = files.find((file) => file.id === selectedFileId) || files[0] || null;

  if (state.loading) {
    return (
      <section className="user-detail-page">
        <EmptyState title="Loading media..." message="Fetching the archive record." />
      </section>
    );
  }

  if (state.error || !resource || !['Image', 'Video'].includes(resource.type)) {
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
            <MediaPlayer file={selectedFile} resource={resource} />
            {files.length > 1 && (
              <div className="user-media-file-strip" aria-label="Media files">
                {files.map((file, index) => {
                  const active = (selectedFile?.id || '') === file.id;
                  return (
                    <button
                      type="button"
                      key={file.id || file.path || index}
                      className={active ? 'is-active' : undefined}
                      onClick={() => setSelectedFileId(file.id)}
                    >
                      {isVideoFile(file) ? (
                        <span>Video {index + 1}</span>
                      ) : (
                        <img src={file.url} alt="" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
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
              {(selectedFile?.resolution || state.media.resolution) && <span>{selectedFile?.resolution || state.media.resolution}</span>}
              {(selectedFile?.size || state.media.size) && <span>{formatFileSize(selectedFile?.size || state.media.size)}</span>}
              {files.length > 1 && <span>{files.length} files</span>}
              {state.media.curator && <span>{state.media.curator}</span>}
            </div>

            <div className="user-detail-actions">
              {(selectedFile?.url || resource.mediaUrl) && (
                <a href={selectedFile?.url || resource.mediaUrl} target="_blank" rel="noreferrer">
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

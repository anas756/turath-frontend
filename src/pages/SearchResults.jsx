import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../app/services/lib/Api';
import Footer from '../components/user/Footer';
import SearchContainer from '../components/user/SearchContainer';
import { htmlToPlainText } from '../utils/richText';
import { getMediaFiles } from '../utils/userResources';
import '../styles/user.css';

const assetBaseUrl = (
  import.meta.env.VITE_BACK_END_URL_IMAGE ||
  import.meta.env.VITE_BACK_END_URL ||
  ''
)
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

const imageFilePattern = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const videoFilePattern = /\.(m4v|mov|mp4|ogg|ogv|webm)(\?.*)?$/i;

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Results' },
  { value: 'archive', label: 'Archive' },
  { value: 'watch', label: 'Videos' },
];

const EMPTY_COUNTS = {};

function resolveAssetUrl(path) {
  const value = path?.toString().trim();
  if (!value || value === 'null') return null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  const cleanPath = value.replace(/^\/+/, '');
  const publicPath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
  return `${assetBaseUrl}/${publicPath}`;
}

function normalizeType(value) {
  if (['archive', 'document', 'documents'].includes(value)) return 'archive';
  if (['watch', 'video', 'videos', 'media'].includes(value)) return 'watch';
  return 'all';
}

function SearchNav() {
  return (
    <header className="guest-navbar">
      <Link to="/home" className="guest-navbar__brand">Turath</Link>
      <nav aria-label="Search navigation">
        <Link to="/home#library-preview">Library Preview</Link>
        <Link to="/home#media-preview">Media Preview</Link>
        <Link to="/home#collections-preview">Collections</Link>
      </nav>
      <div className="guest-navbar__actions">
        <Link to="/login">Sign In</Link>
        <Link to="/signup">Create Account</Link>
      </div>
    </header>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="search-results-empty">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Cover({ src, title, label }) {
  const [failed, setFailed] = useState(false);
  const imageSrc = resolveAssetUrl(src);
  const canUseImage = imageSrc && !failed && imageFilePattern.test(imageSrc);

  if (!canUseImage) {
    return (
      <div className="search-result-cover__fallback" role="img" aria-label={`${title} preview`}>
        {label}
      </div>
    );
  }

  return <img src={imageSrc} alt={title} loading="lazy" onError={() => setFailed(true)} />;
}

function formatPublishedDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function DocumentResultCard({ item }) {
  const authors = Array.isArray(item.authors) ? item.authors.join(', ') : '';
  const tags = Array.isArray(item.tags) ? item.tags.slice(0, 3) : [];

  return (
    <article className="search-result-card search-result-card--document">
      <div className="search-result-cover">
        <Cover src={item.cover} title={item.title} label="Archive" />
      </div>
      <div className="search-result-card__body">
        <div className="search-result-card__meta">
          <span>Archive document</span>
          {item.category && <span>{item.category}</span>}
        </div>
        <h3>{item.title}</h3>
        {authors && <p className="search-result-card__byline">{authors}</p>}
        <p>{htmlToPlainText(item.match || item.description) || 'A Turath archive record from the database.'}</p>
        {tags.length > 0 && (
          <div className="search-result-tags">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}

function MediaPreview({ item }) {
  const [failed, setFailed] = useState(false);
  const primaryFile = getMediaFiles(item)[0];
  const fileUrl = primaryFile?.url || resolveAssetUrl(item.file_path);
  const isVideo = primaryFile?.type
    ? primaryFile.type === 'video'
    : item.type?.toLowerCase() === 'video' || videoFilePattern.test(fileUrl || '');
  const isImage = primaryFile?.type
    ? primaryFile.type === 'image'
    : item.type?.toLowerCase() === 'image' || imageFilePattern.test(fileUrl || '');

  if (isVideo && fileUrl && !failed) {
    return (
      <video
        src={fileUrl}
        controls
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      />
    );
  }

  if (isImage && fileUrl && !failed) {
    return <img src={fileUrl} alt={item.title} loading="lazy" onError={() => setFailed(true)} />;
  }

  return (
    <div className="search-result-cover__fallback" role="img" aria-label={`${item.title} preview`}>
      {item.type || 'Media'}
    </div>
  );
}

function MediaResultCard({ item }) {
  const tags = Array.isArray(item.tags) ? item.tags.slice(0, 3) : [];

  return (
    <article className="search-result-card search-result-card--media">
      <div className="search-result-media">
        <MediaPreview item={item} />
      </div>
      <div className="search-result-card__body">
        <div className="search-result-card__meta">
          <span>{item.type || 'Media'}</span>
          {item.format && <span>{item.format}</span>}
          {Array.isArray(item.files) && item.files.length > 1 && <span>{item.files.length} files</span>}
        </div>
        <h3>{item.title}</h3>
        {item.curator && <p className="search-result-card__byline">Curated by {item.curator}</p>}
        <p>{htmlToPlainText(item.description) || 'A local media item from the Turath database.'}</p>
        {tags.length > 0 && (
          <div className="search-result-tags">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}

function YoutubeResultCard({ item }) {
  const published = formatPublishedDate(item.published_at);

  return (
    <article className="youtube-result-card">
      <a href={item.url} target="_blank" rel="noreferrer" className="youtube-result-card__thumb">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} loading="lazy" />
        ) : (
          <span>YouTube</span>
        )}
        <span className="youtube-result-card__play">Play</span>
      </a>
      <div className="youtube-result-card__body">
        <span>
          {item.result_group || 'YouTube'}
          {published ? ` / ${published}` : ''}
        </span>
        <h3>{item.title}</h3>
        {item.channel && <p className="search-result-card__byline">{item.channel}</p>}
        <p>{item.description || 'External video result related to Moroccan heritage.'}</p>
        <a href={item.url} target="_blank" rel="noreferrer">Watch on YouTube</a>
      </div>
    </article>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || 'Moroccan heritage';
  const type = normalizeType(searchParams.get('type') || 'all');
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let ignore = false;

    queueMicrotask(() => {
      if (!ignore) {
        setState((current) => ({ ...current, loading: true, error: null }));
      }
    });

    api.searchPublic({ query, type })
      .then(({ data }) => {
        if (!ignore) {
          setState({ loading: false, error: null, data: data.data });
        }
      })
      .catch((error) => {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || 'Search failed. Please try again.',
            data: null,
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [query, type]);

  const documents = state.data?.internal?.documents ?? [];
  const media = state.data?.internal?.media ?? [];
  const youtube = state.data?.external?.youtube ?? [];
  const counts = state.data?.counts ?? EMPTY_COUNTS;
  const hasInternal = documents.length > 0 || media.length > 0;
  const hasExternal = youtube.length > 0;
  const showExternalBlock = type !== 'archive';

  const typeCounts = useMemo(() => ({
    all: counts.total ?? 0,
    archive: counts.documents ?? 0,
    watch: (counts.media ?? 0) + (counts.external ?? 0),
  }), [counts]);

  const changeType = (nextType) => {
    setSearchParams({ q: query, type: nextType });
  };

  return (
    <div className="guest-home search-results-page">
      <SearchNav />

      <main>
        <section className="search-results-hero">
          <p className="user-section-eyebrow">Explore Turath</p>
          <h1>Search Moroccan heritage resources.</h1>
          <p>
            Results are separated between the Turath database and latest or popular
            YouTube videos, so guests can see archive records and fresh external media.
          </p>
          <SearchContainer initialQuery={query} initialType={type} />
        </section>

        <section className="search-results-tabs" aria-label="Result filters">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={type === option.value ? 'is-active' : ''}
              onClick={() => changeType(option.value)}
            >
              <span>{option.label}</span>
              <strong>{typeCounts[option.value] ?? 0}</strong>
            </button>
          ))}
        </section>

        {state.loading && (
          <section className="search-results-status">
            <span />
            <p>Searching the Turath database and external video sources...</p>
          </section>
        )}

        {state.error && (
          <section className="search-results-status is-error">
            <p>{state.error}</p>
          </section>
        )}

        {!state.loading && !state.error && (
          <section className={`search-results-grid${showExternalBlock ? '' : ' is-single'}`}>
            <section className="search-results-block">
              <div className="search-results-block__header">
                <div>
                  <p className="user-section-eyebrow">From Turath Database</p>
                  <h2>{counts.internal ?? 0} internal result{counts.internal === 1 ? '' : 's'}</h2>
                </div>
                <span>{query}</span>
              </div>

              {!hasInternal && (
                <EmptyState
                  title="No matching database results yet"
                  text="Try another word, or add more tags and descriptions to local records from the back office."
                />
              )}

              {documents.length > 0 && (
                <div className="search-results-group">
                  <h3>Archive documents</h3>
                  <div className="search-results-list">
                    {documents.map((item) => (
                      <DocumentResultCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {media.length > 0 && (
                <div className="search-results-group">
                  <h3>Local media</h3>
                  <div className="search-results-list">
                    {media.map((item) => (
                      <MediaResultCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {showExternalBlock && (
            <section className="search-results-block search-results-block--external">
              <div className="search-results-block__header">
                <div>
                  <p className="user-section-eyebrow">External Videos</p>
                  <h2>{counts.external ?? 0} YouTube result{counts.external === 1 ? '' : 's'}</h2>
                </div>
                <span>{query}</span>
              </div>

              {state.data?.external?.youtube_message && (
                <div className="search-results-note">
                  {state.data.external.youtube_message}
                </div>
              )}

              {!hasExternal && !state.data?.external?.youtube_message && (
                <EmptyState
                  title="No external videos found"
                  text="Try a broader heritage phrase such as zellige, gnawa, medina, Amazigh, or Moroccan manuscripts."
                />
              )}

              {hasExternal && (
                <div className="youtube-results-list">
                  {youtube.map((item) => (
                    <YoutubeResultCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

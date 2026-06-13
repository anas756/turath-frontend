import { Link } from 'react-router-dom';
import Footer from '../components/user/Footer';
import SectionHeader from '../components/user/SectionHeader';
import SearchContainer from '../components/user/SearchContainer';
import {
  contentFilters,
  heroContent,
  quickAccessItems,
} from '../data/user/homeContent';
import '../styles/user.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchLandingPreview } from '../app/services/reduxTollkit/asyncThunks/landingThunk';
import {
  selectLandingCollectionDocs,
  selectLandingCollectionMedia,
  selectLandingDocuments,
  selectLandingLoading,
  selectLandingMedia,
} from '../app/services/reduxTollkit/Slices/landingSlice';

const assetBaseUrl = (
  import.meta.env.VITE_BACK_END_URL_IMAGE ||
  import.meta.env.VITE_BACK_END_URL ||
  ''
)
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

const imageFilePattern = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const videoFilePattern = /\.(m4v|mov|mp4|ogg|ogv|webm)(\?.*)?$/i;

function resolveAssetUrl(path) {
  const value = path?.toString().trim();
  if (!value || value === 'null') return null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:'))
    return value;
  const cleanPath = value.replace(/^\/+/, '');
  const publicPath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
  return `${assetBaseUrl}/${publicPath}`;
}

function PreviewImage({ src, title, label, mediaType }) {
  const [failed, setFailed] = useState(false);
  const imageSrc = resolveAssetUrl(src);
  const shouldLoadImage =
    imageSrc &&
    !failed &&
    (imageFilePattern.test(imageSrc) || mediaType?.toLowerCase() === 'image');

  if (!shouldLoadImage) {
    return (
      <div className="guest-preview-card__placeholder" role="img" aria-label={`${title} preview`}>
        <strong>{label}</strong>
      </div>
    );
  }
  return <img src={imageSrc} alt={title} loading="lazy" onError={() => setFailed(true)} />;
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function getMediaType(item) {
  return item?.type?.toString().toLowerCase() || 'media';
}

function isVideoMedia(item) {
  const fileUrl = resolveAssetUrl(item?.file_path);
  return getMediaType(item) === 'video' || videoFilePattern.test(fileUrl || '');
}

function mediaMeta(item) {
  return [item.type || 'Media', item.format].filter(Boolean).join(' / ');
}

function MediaPoster({ item, compact = false }) {
  const [failed, setFailed] = useState(false);
  const fileUrl = resolveAssetUrl(item?.file_path);
  const isVideo = isVideoMedia(item);

  if (isVideo && fileUrl && !failed) {
    return (
      <video
        src={fileUrl}
        controls={!compact}
        muted={compact}
        playsInline
        preload="metadata"
        aria-label={`${item.title} video preview`}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <PreviewImage
      src={item?.file_path}
      title={item?.title || 'Media preview'}
      label={item?.type || 'Media'}
      mediaType={item?.type}
    />
  );
}

function GuestNavbar() {
  const navItems = [
    { label: 'Library Preview', href: '#library-preview' },
    { label: 'Media Preview', href: '#media-preview' },
    { label: 'Collections', href: '#collections-preview' },
  ];
  return (
    <header className="guest-navbar">
      <a href="#top" className="guest-navbar__brand">Turath</a>
      <nav aria-label="Guest navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.label}>{item.label}</a>
        ))}
      </nav>
      <div className="guest-navbar__actions">
        <Link to="/login">Sign In</Link>
        <Link to="/signup">Create Account</Link>
      </div>
    </header>
  );
}

function DocumentCard({ item }) {
  return (
    <article className="guest-preview-card">
      <div className="guest-preview-card__image">
        <PreviewImage src={item.cover} title={item.title} label="Document" />
        <span><LockIcon /> Members only</span>
      </div>
      <div className="guest-preview-card__body">
        <div className="guest-preview-card__meta">
          <span>Document</span>
          {item.authors?.length > 0 && <span>{item.authors[0]}</span>}
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="guest-preview-card__actions">
          <Link to="/signup">Unlock Access</Link>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </article>
  );
}

function MediaCard({ item }) {
  return (
    <article className="guest-preview-card">
      <div className="guest-preview-card__image">
        <PreviewImage
          src={item.file_path}
          title={item.title}
          label={item.type || 'Media'}
          mediaType={item.type}
        />
        <span><LockIcon /> Members only</span>
      </div>
      <div className="guest-preview-card__body">
        <div className="guest-preview-card__meta">
          <span>{item.type || 'Media'}</span>
          {item.format && <span>{item.format}</span>}
        </div>
        <h3>{item.title}</h3>
        <p>{item.curator}</p>
        <div className="guest-preview-card__actions">
          <Link to="/signup">Unlock Access</Link>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </article>
  );
}

function GuestMediaShowcase({ items, loading }) {
  if (loading) {
    return (
      <div className="guest-media-showcase">
        <article className="guest-media-feature guest-media-feature--loading">
          <div /><div />
        </article>
        <div className="guest-media-rail">
          {[1, 2, 3].map((n) => (
            <article className="guest-media-rail-item is-loading" key={n}>
              <div /><div />
            </article>
          ))}
        </div>
      </div>
    );
  }

  const featured = items.find((item) => isVideoMedia(item)) || items[0];

  if (!featured) {
    return (
      <div className="guest-media-empty">
        <PlayIcon />
        <h3>No media previews yet</h3>
        <p>Videos, audio, and image records will appear here after they are added.</p>
      </div>
    );
  }

  const featuredId = featured._id || featured.id;
  const otherMedia = items.filter((item) => (item._id || item.id) !== featuredId).slice(0, 4);
  const featuredIsVideo = isVideoMedia(featured);

  return (
    <div className="guest-media-showcase">
      <article className="guest-media-feature">
        <div className="guest-media-feature__stage">
          <MediaPoster item={featured} />
          <span className="guest-media-feature__pill">
            <PlayIcon />
            {featuredIsVideo ? 'Playable preview' : 'Media preview'}
          </span>
        </div>
        <div className="guest-media-feature__body">
          <div className="guest-media-feature__meta">
            <span>{mediaMeta(featured)}</span>
            {featured.resolution && <span>{featured.resolution}</span>}
          </div>
          <h3>{featured.title}</h3>
          <p>
            {featured.curator
              ? `Curated by ${featured.curator}.`
              : 'Preview this archive item, then create an account to keep exploring the full collection.'}
          </p>
          <div className="guest-media-feature__actions">
            <Link to="/signup">Unlock full access</Link>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </article>

      <aside className="guest-media-rail" aria-label="More media previews">
        <div className="guest-media-rail__header">
          <span>More Media</span>
          <Link to="/signup">See all</Link>
        </div>
        {otherMedia.length > 0 ? (
          otherMedia.map((item) => {
            const itemIsVideo = isVideoMedia(item);
            return (
              <article className="guest-media-rail-item" key={item._id || item.id}>
                <div className="guest-media-rail-item__thumb">
                  <MediaPoster item={item} compact />
                  {itemIsVideo && <span><PlayIcon /></span>}
                </div>
                <div>
                  <small>{mediaMeta(item)}</small>
                  <h3>{item.title}</h3>
                  <p>{item.curator || 'Members-only archive preview'}</p>
                </div>
              </article>
            );
          })
        ) : (
          <article className="guest-media-rail-note">
            <h3>More previews are coming</h3>
            <p>Add more media in the back office and they will appear here.</p>
          </article>
        )}
      </aside>
    </div>
  );
}

function CardSkeleton() {
  return (
    <article className="guest-preview-card" style={{ opacity: 0.5 }}>
      <div className="guest-preview-card__image"
        style={{ background: 'var(--color-border-tertiary)' }} />
      <div className="guest-preview-card__body">
        <div style={{ height: 12, width: '60%', background: 'var(--color-border-tertiary)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 16, width: '80%', background: 'var(--color-border-tertiary)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 12, width: '90%', background: 'var(--color-border-tertiary)', borderRadius: 4 }} />
      </div>
    </article>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const documents = useSelector(selectLandingDocuments);
  const media = useSelector(selectLandingMedia);
  const collectionDocs = useSelector(selectLandingCollectionDocs);
  const collectionMedia = useSelector(selectLandingCollectionMedia);
  const loading = useSelector(selectLandingLoading);

  useEffect(() => {
    dispatch(fetchLandingPreview());
  }, [dispatch]);

  return (
    <div className="guest-home" id="top">
      <GuestNavbar />

      <section
        className="user-hero guest-hero"
        style={{ backgroundImage: `url(${heroContent.image})` }}
      >
        <div className="user-hero__content">
          <p className="user-hero__eyebrow">Moroccan Heritage Library</p>
          <h1>
            <span>Preview the heritage archive.</span>
            <em>Create an account to access everything.</em>
          </h1>
          <p className="user-hero__subtitle">
            Guests can browse previews of books, PDFs, documents, media, and
            collections. Reading, downloading, saving, and watching full content
            are unlocked after sign in.
          </p>

          {/* ── Search ── */}
          <SearchContainer />

          <div className="quick-filter-row" aria-label="Guest content filters">
            {contentFilters.map((filter) => (
              <button type="button" key={filter}>{filter}</button>
            ))}
          </div>

          <div className="guest-access-note">
            <LockIcon />
            Full reading, downloads, saves, and media playback require an account.
          </div>
        </div>
      </section>

      <section className="guest-section">
        <SectionHeader
          eyebrow="What You Can Explore"
          title="A guided preview before joining"
        />
        <div className="quick-access-grid">
          {quickAccessItems.map((item) => (
            <Link to="/signup" className="quick-access-card" key={item.id}>
              <span>{item.count}</span>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Library Preview ── */}
      <section className="guest-section guest-section-soft" id="library-preview">
        <SectionHeader
          eyebrow="Library Preview"
          title="Books, PDFs, documents, and manuscripts"
          actionLabel="Create Account to Read"
          actionHref="/signup"
        />
        <div className="guest-preview-grid">
          {loading
            ? [1, 2, 3].map((n) => <CardSkeleton key={n} />)
            : documents.map((doc) => <DocumentCard key={doc._id} item={doc} />)}
        </div>
      </section>

      {/* ── Media Preview ── */}
      <section className="guest-section" id="media-preview">
        <SectionHeader
          eyebrow="Media Preview"
          title="Videos, audio, images, and oral histories"
          actionLabel="Sign In to Watch"
          actionHref="/login"
        />
        <GuestMediaShowcase items={media} loading={loading} />
      </section>

      {/* ── Collections Preview ── */}
      <section className="guest-section guest-section-soft" id="collections-preview">
        <SectionHeader
          eyebrow="Collections Preview"
          title="Themes that combine library and media"
          actionLabel="Join to Save Collections"
          actionHref="/signup"
        />
        <div className="guest-preview-grid">
          {loading ? (
            [1, 2, 3, 4].map((n) => <CardSkeleton key={n} />)
          ) : (
            <>
              {collectionDocs.map((doc) => <DocumentCard key={doc._id} item={doc} />)}
              {collectionMedia.map((item) => <MediaCard key={item._id} item={item} />)}
            </>
          )}
        </div>
      </section>

      <section className="guest-cta">
        <div>
          <p className="user-section-eyebrow">Join Turath</p>
          <h2>Build your personal Moroccan heritage library.</h2>
          <p>
            Create an account to read documents, download files, save resources,
            continue watching media, and get personalized recommendations.
          </p>
        </div>
        <div>
          <Link to="/signup">Create Free Account</Link>
          <Link to="/login">I already have an account</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

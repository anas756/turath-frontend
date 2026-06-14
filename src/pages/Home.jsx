import { Link } from 'react-router-dom';
import Footer from '../components/user/Footer';
import PaginationControls from '../components/user/PaginationControls';
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
  selectLandingCollectionCategories,
  selectLandingDocuments,
  selectLandingLoading,
  selectLandingMedia,
  selectLandingPagination,
} from '../app/services/reduxTollkit/Slices/landingSlice';
import { htmlToPlainText } from '../utils/richText';

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

function getItemId(item) {
  return item?._id || item?.id;
}

function mediaMeta(item) {
  return [item.type || 'Media', item.format].filter(Boolean).join(' / ');
}

function formatFileSize(size) {
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** exponent);
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function MediaPoster({ item, compact = false }) {
  const [failedMediaKey, setFailedMediaKey] = useState(null);
  const fileUrl = resolveAssetUrl(item?.file_path);
  const isVideo = isVideoMedia(item);
  const mediaKey = `${item?.file_path || ''}:${item?.type || ''}`;
  const failed = failedMediaKey === mediaKey;

  if (isVideo && fileUrl && !failed) {
    return (
      <video
        src={fileUrl}
        controls={!compact}
        muted={compact}
        playsInline
        preload="metadata"
        aria-label={`${item.title} video preview`}
        onError={() => setFailedMediaKey(mediaKey)}
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

function listText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value || '';
}

function documentSourceLabel(document) {
  switch (document?.source) {
    case 'gutendex':
      return 'Gutendex';
    case 'google_books':
      return 'Google Books';
    case 'internet_archive':
      return 'Internet Archive';
    case 'open_library':
      return 'Open Library';
    default:
      return document?.open_library_key ? 'Open Library' : 'Local archive';
  }
}

function DocumentCard({ item, onSelect }) {
  const authors = listText(item.authors);
  const shortDescription = htmlToPlainText(item.description) || 'Open this preview to see the document details.';

  return (
    <article
      className="guest-preview-card guest-preview-card--compact"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(item);
        }
      }}
    >
      <div className="guest-preview-card__image">
        <PreviewImage src={item.cover} title={item.title} label="Document" />
        <span><LockIcon /> Members only</span>
      </div>
      <div className="guest-preview-card__body">
        <div className="guest-preview-card__meta">
          <span>Archive</span>
          {authors && <span>{authors.split(',')[0]}</span>}
        </div>
        <h3>{item.title}</h3>
        <p>{shortDescription}</p>
        <strong className="guest-preview-card__hint">View details</strong>
      </div>
    </article>
  );
}

function DocumentDetailsModal({ document, onClose }) {
  if (!document) return null;

  const authors = listText(document.authors);
  const tags = Array.isArray(document.tags) ? document.tags : [];

  return (
    <div className="guest-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="guest-document-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-document-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="guest-document-modal__close"
          onClick={onClose}
          aria-label="Close document details"
        >
          x
        </button>

        <div className="guest-document-modal__cover">
          <PreviewImage src={document.cover} title={document.title} label="Archive" />
        </div>

        <div className="guest-document-modal__body">
          <p className="user-section-eyebrow">Library Preview</p>
          <h2 id="guest-document-modal-title">{document.title}</h2>
          {authors && <p className="guest-document-modal__authors">{authors}</p>}
          <p>
            {htmlToPlainText(document.description) ||
              'This archive record is available in Turath. Login to read the full item and save it to your library.'}
          </p>

          {tags.length > 0 && (
            <div className="guest-document-modal__tags">
              {tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}

          <div className="guest-document-modal__meta">
            <span>Source: {documentSourceLabel(document)}</span>
            {document.open_library_key && <span>Open Library record</span>}
            {document.has_full_text && <span>Readable text available</span>}
          </div>

          <Link to="/login" className="guest-document-modal__cta">
            Login to read
          </Link>
        </div>
      </section>
    </div>
  );
}

function CollectionPreviewCard({ item }) {
  const id = item._id || item.id;
  const documents = item.documents || [];
  const previewNames = documents.slice(0, 3).map((doc) => doc.title).filter(Boolean);
  const banner = resolveAssetUrl(item.banner);

  return (
    <Link to={`/collections/${id}`} className="guest-collection-link">
      <div
        className={banner ? 'guest-collection-link__image' : undefined}
        style={banner ? { backgroundImage: `linear-gradient(180deg, rgba(21, 21, 18, 0.08), rgba(21, 21, 18, 0.58)), url(${banner})` } : undefined}
      >
        <span>{documents.length}</span>
        <small>{documents.length === 1 ? 'item' : 'items'}</small>
      </div>
      <section>
        <p className="user-section-eyebrow">Collection</p>
        <h3>{item.name}</h3>
        <p>{htmlToPlainText(item.description) || 'Explore the documents grouped inside this heritage category.'}</p>
        {previewNames.length > 0 && (
          <ul>
            {previewNames.map((name) => <li key={name}>{name}</li>)}
          </ul>
        )}
      </section>
    </Link>
  );
}

function GuestMediaShowcase({ items = [], loading }) {
  const defaultFeatured = items.find((item) => isVideoMedia(item)) || items[0];
  const [selectedMediaId, setSelectedMediaId] = useState(null);

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

  const featured =
    items.find((item) => getItemId(item) === selectedMediaId) ||
    defaultFeatured;

  if (!featured) {
    return (
      <div className="guest-media-empty">
        <PlayIcon />
        <h3>No media previews yet</h3>
        <p>Videos and image records will appear here after they are added.</p>
      </div>
    );
  }

  const featuredId = getItemId(featured);
  const otherMedia = items.filter((item) => getItemId(item) !== featuredId).slice(0, 5);
  const featuredIsVideo = isVideoMedia(featured);
  const details = [
    ['Curator', featured.curator],
    ['Format', featured.format],
    ['Resolution', featured.resolution],
    ['Size', formatFileSize(featured.size)],
    ['Added', formatDate(featured.date_added || featured.created_at)],
  ].filter(([, value]) => value);

  return (
    <div className="guest-media-showcase">
      <article className="guest-media-feature">
        <div className="guest-media-feature__stage">
          <MediaPoster item={featured} />
          <span className="guest-media-feature__pill">
            {featuredIsVideo && <PlayIcon />}
            {featuredIsVideo ? 'Playable preview' : 'Image preview'}
          </span>
        </div>
        <div className="guest-media-feature__body">
          <div className="guest-media-feature__meta">
            <span>{mediaMeta(featured)}</span>
            {featured.resolution && <span>{featured.resolution}</span>}
          </div>
          <h3>{featured.title}</h3>
          <p>
            {htmlToPlainText(featured.description) ||
              (featured.curator
                ? `Curated by ${featured.curator}.`
                : 'Preview this archive item, then create an account to keep exploring the full collection.')}
          </p>
          {details.length > 0 && (
            <dl className="guest-media-feature__details">
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="guest-media-feature__lock-note">
            <LockIcon />
            Login is required to open the full media record.
          </div>
          <div className="guest-media-feature__actions">
            <Link to="/login">
              <LockIcon />
              Login to view full media
            </Link>
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
            const itemId = getItemId(item);
            return (
              <button
                type="button"
                className="guest-media-rail-item"
                key={itemId}
                onClick={() => setSelectedMediaId(itemId)}
              >
                <div className="guest-media-rail-item__thumb">
                  <MediaPoster item={item} compact />
                  {itemIsVideo && <span><PlayIcon /></span>}
                </div>
                <div>
                  <small>{mediaMeta(item)}</small>
                  <h3>{item.title}</h3>
                  <p>{htmlToPlainText(item.description) || item.curator || 'Members-only archive preview'}</p>
                </div>
              </button>
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
  const collectionCategories = useSelector(selectLandingCollectionCategories);
  const pagination = useSelector(selectLandingPagination);
  const loading = useSelector(selectLandingLoading);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentsPage, setDocumentsPage] = useState(1);
  const [mediaPage, setMediaPage] = useState(1);
  const [collectionsPage, setCollectionsPage] = useState(1);

  useEffect(() => {
    dispatch(fetchLandingPreview({
      documents_page: documentsPage,
      media_page: mediaPage,
      collections_page: collectionsPage,
      documents_per_page: 3,
      media_per_page: 5,
      collections_per_page: 4,
    }));
  }, [collectionsPage, dispatch, documentsPage, mediaPage]);

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

      <section className="guest-section guest-section-soft" id="library-preview">
        <SectionHeader
          eyebrow="Library Preview"
          title="Books, PDFs, documents, and manuscripts"
        />
        <div className="guest-preview-grid">
          {loading
            ? [1, 2, 3].map((n) => <CardSkeleton key={n} />)
            : documents.map((doc) => (
              <DocumentCard
                key={doc._id || doc.id}
                item={doc}
                onSelect={setSelectedDocument}
              />
            ))}
        </div>
        <PaginationControls
          pagination={pagination?.documents}
          onPageChange={setDocumentsPage}
          loading={loading}
        />
      </section>

      <section className="guest-section" id="media-preview">
        <SectionHeader
          eyebrow="Media Preview"
          title="Videos and images from the archive"
        />
        <GuestMediaShowcase items={media} loading={loading} />
        <PaginationControls
          pagination={pagination?.media}
          onPageChange={setMediaPage}
          loading={loading}
        />
      </section>

      <section className="guest-section guest-section-soft" id="collections-preview">
        <SectionHeader
          eyebrow="Collections Preview"
          title="Browse heritage collections by category"
        />
        <div className="guest-collection-list">
          {loading ? (
            [1, 2, 3, 4].map((n) => <CardSkeleton key={n} />)
          ) : collectionCategories.length > 0 ? (
            collectionCategories.map((category) => (
              <CollectionPreviewCard key={category._id || category.id} item={category} />
            ))
          ) : (
            <div className="guest-media-empty">
              <h3>No collections yet</h3>
              <p>Create categories in the back office and they will appear here.</p>
            </div>
          )}
        </div>
        <PaginationControls
          pagination={pagination?.collections}
          onPageChange={setCollectionsPage}
          loading={loading}
        />
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

      <DocumentDetailsModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  );
}

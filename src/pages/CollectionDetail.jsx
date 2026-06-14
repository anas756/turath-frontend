import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../app/services/lib/Api';
import Footer from '../components/user/Footer';
import PaginationControls from '../components/user/PaginationControls';
import RichText from '../components/common/RichText';
import { htmlToPlainText } from '../utils/richText';
import '../styles/user.css';

const assetBaseUrl = (
  import.meta.env.VITE_BACK_END_URL_IMAGE ||
  import.meta.env.VITE_BACK_END_URL ||
  ''
)
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

const imageFilePattern = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const PAGE_SIZE = 9;

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

function CollectionNav() {
  return (
    <header className="guest-navbar">
      <Link to="/home" className="guest-navbar__brand">Turath</Link>
      <nav aria-label="Collection navigation">
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

function DocumentCover({ item }) {
  const [failed, setFailed] = useState(false);
  const src = resolveAssetUrl(item.cover);

  if (!src || failed || !imageFilePattern.test(src)) {
    return (
      <div className="collection-document-card__fallback" role="img" aria-label={`${item.title} preview`}>
        Archive
      </div>
    );
  }

  return <img src={src} alt={item.title} loading="lazy" onError={() => setFailed(true)} />;
}

function listText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value || '';
}

function listItems(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function CollectionDocumentCard({ item }) {
  const authors = listText(item.authors);
  const tags = listItems(item.tags).slice(0, 3);

  return (
    <article className="collection-document-card">
      <div className="collection-document-card__cover">
        <DocumentCover item={item} />
      </div>
      <div className="collection-document-card__body">
        <div className="guest-preview-card__meta">
          <span>Archive</span>
          {authors && <span>{authors.split(',')[0]}</span>}
        </div>
        <h3>{item.title}</h3>
        {authors && <p className="collection-document-card__authors">{authors}</p>}
        <p>{htmlToPlainText(item.description) || 'Login to read this full archive item.'}</p>
        {tags.length > 0 && (
          <div className="guest-document-modal__tags">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}
        <Link to="/login">Login to read</Link>
      </div>
    </article>
  );
}

export default function CollectionDetail() {
  const { id } = useParams();
  const [state, setState] = useState({
    loading: true,
    error: null,
    collection: null,
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;

    api.getCategorie(id)
      .then(({ data }) => {
        if (!ignore) {
          setState({ loading: false, error: null, collection: data.data });
        }
      })
      .catch((error) => {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || 'Failed to load this collection.',
            collection: null,
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const collection = state.collection;
  const documents = collection?.documents || [];
  const lastPage = Math.max(1, Math.ceil(documents.length / PAGE_SIZE));
  const currentPage = Math.min(page, lastPage);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedDocuments = documents.slice(pageStart, pageStart + PAGE_SIZE);
  const documentsPagination = {
    current_page: currentPage,
    last_page: lastPage,
    per_page: PAGE_SIZE,
    total: documents.length,
    from: documents.length ? pageStart + 1 : null,
    to: Math.min(pageStart + PAGE_SIZE, documents.length),
  };
  const bannerUrl = resolveAssetUrl(collection?.banner);
  const heroStyle = bannerUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(0, 78, 138, 0.78), rgba(21, 21, 18, 0.68)), url("${bannerUrl.replace(/"/g, '\\"')}")`,
      }
    : undefined;

  return (
    <div className="guest-home collection-detail-page">
      <CollectionNav />

      <main>
        <section className="collection-detail-hero" style={heroStyle}>
          <Link to="/home#collections-preview">Back to collections</Link>
          <p className="user-section-eyebrow">Collection</p>
          <h1>{collection?.name || 'Loading collection'}</h1>
          <RichText
            html={collection?.description}
            className="rich-text collection-detail-hero__description"
            fallback={<p>Browse the documents grouped under this heritage category.</p>}
          />
          <div className="collection-detail-hero__count">
            <span>{documents.length}</span>
            <small>{documents.length === 1 ? 'document' : 'documents'}</small>
          </div>
        </section>

        {state.loading && (
          <section className="collection-detail-status">
            Loading collection...
          </section>
        )}

        {state.error && (
          <section className="collection-detail-status is-error">
            {state.error}
          </section>
        )}

        {!state.loading && !state.error && (
          <section className="collection-detail-content">
            {documents.length > 0 ? (
              <>
                <div className="collection-document-grid">
                  {pagedDocuments.map((doc) => (
                    <CollectionDocumentCard key={doc._id || doc.id} item={doc} />
                  ))}
                </div>
                <PaginationControls
                  pagination={documentsPagination}
                  onPageChange={setPage}
                  loading={state.loading}
                />
              </>
            ) : (
              <div className="guest-media-empty">
                <h3>This collection is empty</h3>
                <p>Add documents to this category from the back office.</p>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

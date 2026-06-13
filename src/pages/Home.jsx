import { Link } from 'react-router-dom';
import Footer from '../components/user/Footer';
import SectionHeader from '../components/user/SectionHeader';
import {
  collectionItems,
  contentFilters,
  heroContent,
  libraryItems,
  mediaItems,
  quickAccessItems,
} from '../data/user/homeContent';
import '../styles/user.css';

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
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
      <a href="#top" className="guest-navbar__brand">
        Turath
      </a>

      <nav aria-label="Guest navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.label}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="guest-navbar__actions">
        <Link to="/login">Sign In</Link>
        <Link to="/signup">Create Account</Link>
      </div>
    </header>
  );
}

function LockedResourceCard({ item }) {
  const image = item.thumbnail || item.coverImage || item.image;
  const meta = item.pages || item.duration || item.length || item.itemCount;

  return (
    <article className="guest-preview-card">
      <div className="guest-preview-card__image">
        <img src={image} alt="" style={{ objectPosition: item.imagePosition }} />
        <span>
          <LockIcon />
          Members only
        </span>
      </div>

      <div className="guest-preview-card__body">
        <div className="guest-preview-card__meta">
          <span>{item.type || 'Collection'}</span>
          <span>{meta}</span>
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

export default function Home() {
  const previewLibrary = libraryItems.slice(0, 3);
  const previewMedia = mediaItems.slice(0, 3);
  const previewCollections = collectionItems.slice(0, 3);

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

          <form
            className="user-hero-search guest-hero-search"
            aria-label="Preview archive search"
            onSubmit={(event) => event.preventDefault()}
          >
            <SearchIcon />
            <input type="search" placeholder={heroContent.placeholder} />
            <Link to="/signup">Unlock Search</Link>
          </form>

          <div className="quick-filter-row" aria-label="Guest content filters">
            {contentFilters.map((filter) => (
              <button type="button" key={filter}>
                {filter}
              </button>
            ))}
          </div>

          <div className="guest-access-note">
            <LockIcon />
            Full reading, downloads, saves, and media playback require an
            account.
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
          actionLabel="Create Account to Read"
          actionHref="/signup"
        />

        <div className="guest-preview-grid">
          {previewLibrary.map((item) => (
            <LockedResourceCard item={item} key={item.id} />
          ))}
        </div>
      </section>

      <section className="guest-section" id="media-preview">
        <SectionHeader
          eyebrow="Media Preview"
          title="Videos, audio, images, and oral histories"
          actionLabel="Sign In to Watch"
          actionHref="/login"
        />

        <div className="guest-preview-grid">
          {previewMedia.map((item) => (
            <LockedResourceCard item={item} key={item.id} />
          ))}
        </div>
      </section>

      <section className="guest-section guest-section-soft" id="collections-preview">
        <SectionHeader
          eyebrow="Collections Preview"
          title="Themes that combine library and media"
          actionLabel="Join to Save Collections"
          actionHref="/signup"
        />

        <div className="guest-preview-grid">
          {previewCollections.map((item) => (
            <LockedResourceCard item={item} key={item.id} />
          ))}
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

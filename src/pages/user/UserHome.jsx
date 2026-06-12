import CollectionCard from '../../components/user/CollectionCard';
import EmptyState from '../../components/user/EmptyState';
import { MediaFeature, MediaListItem } from '../../components/user/MediaFeature';
import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import {
  collectionItems,
  contentFilters,
  heroContent,
  libraryItems,
  mediaItems,
  myLibraryItems,
  quickAccessItems,
} from '../../data/user/homeContent';

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

function SparkleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
      <path d="M5 14l.6 1.4L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.6L5 14z" />
    </svg>
  );
}

export default function UserHome() {
  const featuredMedia = mediaItems.find((item) => item.featured) || mediaItems[0];
  const mediaListItems = featuredMedia
    ? mediaItems.filter((item) => item.id !== featuredMedia.id)
    : [];

  return (
    <div className="user-home" id="top">
      <section
        className="user-hero"
        style={{ backgroundImage: `url(${heroContent.image})` }}
        id="discover"
      >
        <div className="user-hero__content">
          <p className="user-hero__eyebrow">{heroContent.eyebrow}</p>
          <h1>
            <span>{heroContent.title}</span>
            <em>{heroContent.accent}</em>
          </h1>
          <p className="user-hero__subtitle">{heroContent.subtitle}</p>

          <form
            className="user-hero-search"
            aria-label="Search digital archives"
            onSubmit={(event) => event.preventDefault()}
          >
            <SearchIcon />
            <input type="search" placeholder={heroContent.placeholder} />
            <button type="submit">Discover</button>
          </form>

          <div className="quick-filter-row" aria-label="Quick content filters">
            {contentFilters.map((filter) => (
              <button type="button" key={filter}>
                {filter}
              </button>
            ))}
          </div>

          <div className="hero-stats" aria-label="Library summary">
            {heroContent.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="user-section access-section" id="start-here">
        <SectionHeader
          eyebrow="Start Here"
          title="What do you need today?"
          actionLabel="Browse Library"
          actionHref="#library"
        />

        <div className="quick-access-grid">
          {quickAccessItems.map((item) => (
            <a href={`#${item.id}`} className="quick-access-card" key={item.id}>
              <span>{item.count}</span>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="user-section library-section" id="library">
        <SectionHeader
          eyebrow="Library"
          title="Books, PDFs, documents, and manuscripts"
          actionLabel="View All Library"
          actionHref="#library"
        />

        <ResourceShelf items={libraryItems} />
      </section>

      <section className="user-section media-section" id="media">
        <SectionHeader
          eyebrow="Media"
          title="Videos, audio, images, and oral histories"
          actionLabel="Open Media Library"
          actionHref="#media"
        />

        {featuredMedia ? (
          <div className="media-grid">
            <MediaFeature exhibit={featuredMedia} />

            <div className="media-list" aria-label="More media items">
              {mediaListItems.map((item) => (
                <MediaListItem item={item} key={item.id} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No media yet"
            message="Videos, audio, and image records can be rendered here once the API is connected."
          />
        )}
      </section>

      <section className="user-section collections-section" id="collections">
        <SectionHeader
          eyebrow="Collections"
          title="Library and media grouped by theme"
          actionLabel="All Collections"
          actionHref="#collections"
        />

        {collectionItems.length ? (
          <div className="collection-grid">
            {collectionItems.map((collection) => (
              <CollectionCard collection={collection} key={collection.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No collections yet"
            message="Mixed library and media collections will appear here."
          />
        )}
      </section>

      <section className="user-section saved-section" id="my-library">
        <SectionHeader
          eyebrow="My Library"
          title="Saved resources and progress"
          actionLabel="View Saved Items"
          actionHref="#my-library"
        />

        <ResourceShelf items={myLibraryItems} columns={2} />

        <button
          type="button"
          className="library-assistant"
          aria-label="Open library assistant"
          title="Open library assistant"
        >
          <SparkleIcon />
        </button>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import {
  contentFilters,
  heroContent,
} from '../../data/user/homeContent';
import useUserArchiveData from '../../hooks/useUserArchiveData';

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

export default function UserHome() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const {
    user,
    documentResources,
    mediaResources,
    collectionResources,
    favorite,
    loading,
  } = useUserArchiveData();

  const displayName = user?.name?.split(' ')[0] || user?.userName || user?.username || 'reader';
  const recentDocuments = documentResources.slice(0, 3);
  const recentMedia = mediaResources.slice(0, 3);

  const quickAccessItems = useMemo(() => ([
    {
      id: 'library',
      to: '/user/library',
      label: 'Library',
      description: 'Books, PDFs, documents, manuscripts, and articles.',
      count: `${documentResources.length} items`,
    },
    {
      id: 'media',
      to: '/user/media',
      label: 'Media',
      description: 'Videos, images, documentaries, and visual heritage records.',
      count: `${mediaResources.length} assets`,
    },
    {
      id: 'collections',
      to: '/user/collections',
      label: 'Collections',
      description: 'Library resources grouped by heritage category.',
      count: `${collectionResources.length} sets`,
    },
    {
      id: 'my-library',
      to: '/user/my-library',
      label: 'My Library',
      description: 'Saved items and favorites from your archive work.',
      count: `${favorite.counts?.total || 0} saved`,
    },
  ]), [collectionResources.length, documentResources.length, favorite.counts?.total, mediaResources.length]);

  const stats = [
    { value: documentResources.length, label: 'Library Items' },
    { value: mediaResources.length, label: 'Media Assets' },
    { value: collectionResources.length, label: 'Collections' },
  ];

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    navigate(`/user/library${params.toString() ? `?${params.toString()}` : ''}`);
  };

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
            <span>Welcome back, {displayName}.</span>
            <em>Explore the live Turath archive.</em>
          </h1>
          <p className="user-hero__subtitle">{heroContent.subtitle}</p>

          <form
            className="user-hero-search"
            aria-label="Search digital archives"
            onSubmit={handleSearch}
          >
            <SearchIcon />
            <input
              type="search"
              placeholder={heroContent.placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
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
            {stats.map((stat) => (
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
          actionHref="/user/library"
        />

        <div className="quick-access-grid">
          {quickAccessItems.map((item) => (
            <Link to={item.to} className="quick-access-card" key={item.id}>
              <span>{item.count}</span>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="user-section user-section-soft" id="latest-library">
        <SectionHeader
          eyebrow={loading ? 'Loading' : 'Latest Library'}
          title="Recently added documents"
          actionLabel="View All"
          actionHref="/user/library"
        />
        <ResourceShelf items={recentDocuments} />
      </section>

      <section className="user-section" id="latest-media">
        <SectionHeader
          eyebrow={loading ? 'Loading' : 'Latest Media'}
          title="New media from the archive"
          actionLabel="Browse Media"
          actionHref="/user/media"
        />
        <ResourceShelf items={recentMedia} />
      </section>
    </div>
  );
}

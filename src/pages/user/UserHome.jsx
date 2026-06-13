import { Link } from 'react-router-dom';
import SectionHeader from '../../components/user/SectionHeader';
import {
  contentFilters,
  heroContent,
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

export default function UserHome() {
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
    </div>
  );
}

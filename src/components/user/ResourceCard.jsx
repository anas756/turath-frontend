import { Link } from 'react-router-dom';

export default function ResourceCard({ item, compact = false }) {
  const image = item.image || item.thumbnail || item.coverImage;
  const imagePosition = item.imagePosition || 'center';
  const summary = item.summary || item.description;
  const type = item.type || item.resourceType || item.source;
  const length = item.length || item.duration || item.pages || item.itemCount;
  const actionLabel = item.cta || item.actionLabel || 'Open';
  const href = item.href || `#${item.id}`;
  const isInternalRoute = href.startsWith('/');

  return (
    <article className={`resource-card${compact ? ' is-compact' : ''}`}>
      <div className="resource-card__image-wrap">
        <img
          src={image}
          alt=""
          className="resource-card__image"
          style={{ objectPosition: imagePosition }}
        />
        <span className="resource-card__type">{type}</span>
      </div>

      <div className="resource-card__body">
        <div className="resource-card__meta">
          <span>{item.format}</span>
          <span>{length}</span>
        </div>

        <h3>{item.title}</h3>
        <p>{summary}</p>

        {typeof item.progress === 'number' && (
          <div className="resource-progress" aria-label={`${item.progress}% complete`}>
            <span style={{ width: `${item.progress}%` }} />
          </div>
        )}

        <div className="resource-card__footer">
          <span>{item.category}</span>
          {isInternalRoute ? (
            <Link to={href}>{actionLabel}</Link>
          ) : (
            <a href={href}>{actionLabel}</a>
          )}
        </div>
      </div>
    </article>
  );
}

import { Link } from 'react-router-dom';

export default function CollectionCard({ collection }) {
  const image = collection.image || collection.coverImage || collection.thumbnail;
  const summary = collection.summary || collection.description;
  const count = collection.count || collection.itemCount;
  const content = (
    <div>
      <span>{count}</span>
      <h3>{collection.title}</h3>
      <p>{summary}</p>
      {collection.sourceTypes && (
        <div className="collection-card__tags">
          {collection.sourceTypes.map((type) => (
            <small key={type}>{type}</small>
          ))}
        </div>
      )}
    </div>
  );

  const sharedProps = {
    className: 'collection-card',
    style: {
      backgroundImage: `linear-gradient(180deg, rgba(21, 21, 18, 0.1), rgba(21, 21, 18, 0.76)), url(${image})`,
      backgroundPosition: collection.imagePosition || 'center',
    },
  };

  if (collection.href) {
    return (
      <Link to={collection.href} {...sharedProps}>
        {content}
      </Link>
    );
  }

  return (
    <article {...sharedProps}>
      {content}
    </article>
  );
}

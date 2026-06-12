import ResourceCard from './ResourceCard';
import EmptyState from './EmptyState';

export default function ResourceShelf({ items = [], compact = false, columns = 3 }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No resources yet"
        message="This shelf is ready for items from the database."
      />
    );
  }

  return (
    <div
      className={`resource-grid${columns === 2 ? ' is-two-column' : ''}`}
    >
      {items.map((item) => (
        <ResourceCard item={item} key={item.id} compact={compact} />
      ))}
    </div>
  );
}

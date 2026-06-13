import CollectionCard from '../../components/user/CollectionCard';
import EmptyState from '../../components/user/EmptyState';
import SectionHeader from '../../components/user/SectionHeader';
import { collectionItems } from '../../data/user/homeContent';

const collectionFilters = ['All', 'Library + Media', 'Architecture', 'Culture', 'Craftsmanship'];

export default function UserCollections() {
  return (
    <section className="user-page collections-page">
      <div className="user-page-shell">
        <SectionHeader
          eyebrow="Collections"
          title="Library and media grouped by theme"
          actionLabel="Featured Sets"
          actionHref="#collection-results"
        />

        <div className="user-page-toolbar">
          <input type="search" placeholder="Search collections..." />
          <div>
            {collectionFilters.map((filter) => (
              <button type="button" key={filter}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        {collectionItems.length ? (
          <div className="collection-grid" id="collection-results">
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
      </div>
    </section>
  );
}

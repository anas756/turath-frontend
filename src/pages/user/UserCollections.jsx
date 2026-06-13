import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollectionCard from '../../components/user/CollectionCard';
import EmptyState from '../../components/user/EmptyState';
import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import useUserArchiveData from '../../hooks/useUserArchiveData';
import { getId, mapDocumentToResource, matchesText } from '../../utils/userResources';

export default function UserCollections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const selectedCollectionId = searchParams.get('collection');
  const {
    categories,
    collectionResources,
    loading,
  } = useUserArchiveData();

  const filteredCollections = useMemo(
    () => collectionResources.filter((collection) => matchesText(collection, query, ['title', 'description'])),
    [collectionResources, query]
  );

  const selectedCategory =
    categories.find((category) => getId(category) === selectedCollectionId) ||
    categories[0];
  const selectedDocuments = selectedCategory?.documents || [];
  const selectedResources = selectedDocuments.map((document) =>
    mapDocumentToResource(document, categories)
  );

  const handleCollectionClick = (collection) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('collection', getId(collection));
    setSearchParams(nextParams);
  };

  return (
    <section className="user-page collections-page">
      <div className="user-page-shell">
        <SectionHeader
          eyebrow="Collections"
          title="Library resources grouped by category"
          actionLabel={`${filteredCollections.length} Collections`}
          actionHref="#collection-results"
        />

        <div className="user-page-toolbar">
          <input
            type="search"
            placeholder="Search collections..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {filteredCollections.length ? (
          <>
            <div className="collection-grid" id="collection-results">
              {filteredCollections.map((collection) => (
                <button
                  type="button"
                  className="collection-card-button"
                  key={collection.id}
                  onClick={() => handleCollectionClick(collection)}
                >
                  <CollectionCard
                    collection={{
                      ...collection,
                      href: null,
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="user-page-block">
              <SectionHeader
                eyebrow="Selected Collection"
                title={selectedCategory?.name || 'Collection contents'}
                actionLabel={`${selectedResources.length} Items`}
                actionHref="#collection-results"
              />
              <ResourceShelf items={selectedResources} />
            </div>
          </>
        ) : (
          <EmptyState
            title={loading ? 'Loading collections...' : 'No collections found'}
            message={loading ? 'Fetching categories from the archive.' : 'Try another search.'}
          />
        )}
      </div>
    </section>
  );
}

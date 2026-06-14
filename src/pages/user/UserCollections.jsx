import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollectionCard from '../../components/user/CollectionCard';
import EmptyState from '../../components/user/EmptyState';
import PaginationControls from '../../components/user/PaginationControls';
import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import useUserArchiveData from '../../hooks/useUserArchiveData';
import { getId, mapDocumentToResource } from '../../utils/userResources';

const COLLECTIONS_PAGE_SIZE = 6;
const COLLECTION_ITEMS_PAGE_SIZE = 6;

export default function UserCollections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [collectionsPage, setCollectionsPage] = useState(1);
  const [collectionItemsPage, setCollectionItemsPage] = useState(1);
  const selectedCollectionId = searchParams.get('collection');
  const categoriesParams = useMemo(() => ({
    page: collectionsPage,
    per_page: COLLECTIONS_PAGE_SIZE,
    ...(query.trim() ? { search: query.trim() } : {}),
  }), [collectionsPage, query]);
  const {
    categories,
    collectionResources,
    categoriesPagination,
    loading,
  } = useUserArchiveData({
    loadDocuments: false,
    loadMedia: false,
    categoriesParams,
  });

  const filteredCollections = collectionResources;

  const selectedCategory =
    categories.find((category) => getId(category) === selectedCollectionId) ||
    categories[0];
  const selectedDocuments = selectedCategory?.documents || [];
  const selectedResources = selectedDocuments.map((document) =>
    mapDocumentToResource(document, categories)
  );
  const selectedItemsTotal = selectedResources.length;
  const selectedItemsStart = (collectionItemsPage - 1) * COLLECTION_ITEMS_PAGE_SIZE;
  const pagedSelectedResources = selectedResources.slice(
    selectedItemsStart,
    selectedItemsStart + COLLECTION_ITEMS_PAGE_SIZE
  );
  const selectedItemsPagination = {
    current_page: collectionItemsPage,
    last_page: Math.max(1, Math.ceil(selectedItemsTotal / COLLECTION_ITEMS_PAGE_SIZE)),
    per_page: COLLECTION_ITEMS_PAGE_SIZE,
    total: selectedItemsTotal,
    from: selectedItemsTotal ? selectedItemsStart + 1 : null,
    to: Math.min(selectedItemsStart + COLLECTION_ITEMS_PAGE_SIZE, selectedItemsTotal),
  };

  const handleCollectionClick = (collection) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('collection', getId(collection));
    setSearchParams(nextParams);
    setCollectionItemsPage(1);
  };

  return (
    <section className="user-page collections-page">
      <div className="user-page-shell">
        <SectionHeader
          eyebrow="Collections"
          title="Library resources grouped by category"
          actionLabel={`${categoriesPagination?.total ?? filteredCollections.length} Collections`}
          actionHref="#collection-results"
        />

        <div className="user-page-toolbar">
          <input
            type="search"
            placeholder="Search collections..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCollectionsPage(1);
              setCollectionItemsPage(1);
            }}
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
            <PaginationControls
              pagination={categoriesPagination}
              onPageChange={(nextPage) => {
                setCollectionsPage(nextPage);
                setCollectionItemsPage(1);
              }}
              loading={loading}
            />

            <div className="user-page-block">
              <SectionHeader
                eyebrow="Selected Collection"
                title={selectedCategory?.name || 'Collection contents'}
                actionLabel={`${selectedResources.length} Items`}
                actionHref="#collection-results"
              />
              <ResourceShelf items={pagedSelectedResources} />
              <PaginationControls
                pagination={selectedItemsPagination}
                onPageChange={setCollectionItemsPage}
                loading={loading}
              />
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

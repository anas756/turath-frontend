import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import useUserArchiveData from '../../hooks/useUserArchiveData';
import { removeFavorite } from '../../app/services/reduxTollkit/asyncThunks/FavoriteThunk';
import { getId, matchesText } from '../../utils/userResources';

const myLibraryFilters = ['All', 'Library', 'Media'];

export default function MyLibrary() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const {
    documentResources,
    mediaResources,
    favoriteDocuments,
    favoriteMedia,
    favorite,
    loading,
  } = useUserArchiveData();

  const savedItems = useMemo(() => {
    const savedDocuments = favoriteDocuments
      .map((favoriteItem) => {
        const resource = documentResources.find((item) => getId(item) === favoriteItem.favorable_id);
        if (!resource) return null;
        return {
          ...resource,
          sourceLabel: 'Library',
          secondaryActionLabel: 'Remove saved',
          secondaryActionTone: 'danger',
          onSecondaryAction: () => dispatch(removeFavorite({
            type: 'document',
            favorableId: getId(resource),
          })),
        };
      })
      .filter(Boolean);

    const savedMedia = favoriteMedia
      .map((favoriteItem) => {
        const resource = mediaResources.find((item) => getId(item) === favoriteItem.favorable_id);
        if (!resource) return null;
        return {
          ...resource,
          sourceLabel: 'Media',
          secondaryActionLabel: 'Remove saved',
          secondaryActionTone: 'danger',
          onSecondaryAction: () => dispatch(removeFavorite({
            type: 'media',
            favorableId: getId(resource),
          })),
        };
      })
      .filter(Boolean);

    return [...savedDocuments, ...savedMedia];
  }, [dispatch, documentResources, favoriteDocuments, favoriteMedia, mediaResources]);

  const filteredItems = savedItems.filter((item) => {
    const matchesQuery = matchesText(item, query);
    const matchesType = typeFilter === 'All' || item.sourceLabel === typeFilter;
    return matchesQuery && matchesType;
  });

  return (
    <section className="user-page my-library-page">
      <div className="user-page-shell">
        <SectionHeader
          eyebrow="My Library"
          title="Saved resources and progress"
          actionLabel={`${favorite.counts?.total || 0} Saved`}
          actionHref="#saved-results"
        />

        <div className="user-page-toolbar">
          <input
            type="search"
            placeholder="Search saved resources..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div>
            {myLibraryFilters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={typeFilter === filter ? 'is-active' : undefined}
                onClick={() => setTypeFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div id="saved-results">
          <ResourceShelf items={filteredItems} columns={2} />
          {loading && !savedItems.length && (
            <p className="user-page-note">Loading saved resources...</p>
          )}
        </div>
      </div>
    </section>
  );
}

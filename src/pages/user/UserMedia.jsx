import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import EmptyState from '../../components/user/EmptyState';
import { MediaFeature, MediaListItem } from '../../components/user/MediaFeature';
import PaginationControls from '../../components/user/PaginationControls';
import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import useUserArchiveData from '../../hooks/useUserArchiveData';
import { addMediaFavorite, removeFavorite } from '../../app/services/reduxTollkit/asyncThunks/FavoriteThunk';
import { getId } from '../../utils/userResources';

const mediaFilters = ['All', 'Video', 'Image'];
const PAGE_SIZE = 9;

export default function UserMedia() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const mediaParams = useMemo(() => ({
    page,
    per_page: PAGE_SIZE,
    status: 'active',
    ...(query.trim() ? { search: query.trim() } : {}),
    ...(typeFilter !== 'All' ? { type: typeFilter.toLowerCase() } : {}),
  }), [page, query, typeFilter]);
  const {
    mediaResources,
    favoriteMedia,
    isMediaFavorite,
    mediaPagination,
    loading,
  } = useUserArchiveData({
    loadDocuments: false,
    loadCategories: false,
    mediaParams,
  });

  const filteredMedia = mediaResources;

  const featuredMedia =
    filteredMedia.find((item) => getId(item) === selectedId) ||
    filteredMedia.find((item) => item.isVideo) ||
    filteredMedia[0];

  const mediaListItems = featuredMedia
    ? filteredMedia.filter((item) => getId(item) !== getId(featuredMedia)).slice(0, 5)
    : [];

  const shelfItems = filteredMedia.map((item) => {
    const saved = isMediaFavorite(item);
    const id = getId(item);
    return {
      ...item,
      secondaryActionLabel: saved ? 'Remove saved' : 'Save',
      secondaryActionTone: saved ? 'danger' : undefined,
      onSecondaryAction: () => {
        if (saved) {
          dispatch(removeFavorite({ type: 'media', favorableId: id }));
        } else {
          dispatch(addMediaFavorite(id));
        }
      },
    };
  });

  return (
    <section className="user-page media-page">
      <div className="user-page-shell">
        <SectionHeader
          eyebrow="Media"
          title="Videos and images from the archive"
          actionLabel={`${mediaPagination?.total ?? filteredMedia.length} Results`}
          actionHref="#media-results"
        />

        <div className="user-page-toolbar">
          <input
            type="search"
            placeholder="Search media..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
              setSelectedId(null);
            }}
          />
          <div>
            {mediaFilters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={typeFilter === filter ? 'is-active' : undefined}
                onClick={() => {
                  setTypeFilter(filter);
                  setPage(1);
                  setSelectedId(null);
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {featuredMedia ? (
          <>
            <div className="media-grid">
              <MediaFeature exhibit={featuredMedia} />

              <div className="media-list" aria-label="More media items">
                {mediaListItems.map((item) => (
                  <MediaListItem
                    item={item}
                    key={item.id}
                    onSelect={() => setSelectedId(getId(item))}
                    isActive={getId(item) === selectedId}
                  />
                ))}
              </div>
            </div>

            <div className="user-page-block" id="media-results">
              <SectionHeader eyebrow="All Media" title="Browse media records" />
              <ResourceShelf items={shelfItems} />
              <PaginationControls
                pagination={mediaPagination}
                onPageChange={(nextPage) => {
                  setPage(nextPage);
                  setSelectedId(null);
                }}
                loading={loading}
              />
              {favoriteMedia.length > 0 && (
                <p className="user-page-note">{favoriteMedia.length} saved media items in your library.</p>
              )}
            </div>
          </>
        ) : (
          <EmptyState
            title={loading ? 'Loading media...' : 'No media found'}
            message={loading ? 'Fetching the archive media.' : 'Try another search or filter.'}
          />
        )}
      </div>
    </section>
  );
}

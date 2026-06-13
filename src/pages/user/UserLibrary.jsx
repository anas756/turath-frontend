import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import useUserArchiveData from '../../hooks/useUserArchiveData';
import { addDocumentFavorite, removeFavorite } from '../../app/services/reduxTollkit/asyncThunks/FavoriteThunk';
import { getId, matchesText } from '../../utils/userResources';

const typeFilters = ['All', 'Open Library', 'Document'];

export default function UserLibrary() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('');
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const {
    categories,
    documentResources,
    favoriteDocuments,
    isDocumentFavorite,
    loading,
  } = useUserArchiveData();

  const filteredItems = useMemo(() => {
    return documentResources.filter((item) => {
      const matchesQuery = matchesText(item, query);
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesCategory = !categoryFilter || item.categorie_id === categoryFilter;
      return matchesQuery && matchesType && matchesCategory;
    });
  }, [categoryFilter, documentResources, query, typeFilter]);

  const items = filteredItems.map((item) => {
    const saved = isDocumentFavorite(item);
    const id = getId(item);
    return {
      ...item,
      secondaryActionLabel: saved ? 'Remove saved' : 'Save',
      secondaryActionTone: saved ? 'danger' : undefined,
      onSecondaryAction: () => {
        if (saved) {
          dispatch(removeFavorite({ type: 'document', favorableId: id }));
        } else {
          dispatch(addDocumentFavorite(id));
        }
      },
    };
  });

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set('q', value);
    else nextParams.delete('q');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <section className="user-page library-page">
      <div className="user-page-shell">
        <SectionHeader
          eyebrow="Library"
          title="Books, PDFs, documents, and manuscripts"
          actionLabel={`${filteredItems.length} Results`}
          actionHref="#library-results"
        />

        <div className="user-page-toolbar">
          <input
            type="search"
            placeholder="Search title, author, category..."
            value={query}
            onChange={handleSearchChange}
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="user-toolbar-select"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={getId(category)} value={getId(category)}>
                {category.name}
              </option>
            ))}
          </select>
          <div>
            {typeFilters.map((filter) => (
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

        <div id="library-results">
          <ResourceShelf
            items={items}
            compact={false}
          />
          {loading && !documentResources.length && (
            <p className="user-page-note">Loading your library...</p>
          )}
          {favoriteDocuments.length > 0 && (
            <p className="user-page-note">{favoriteDocuments.length} saved document items in your library.</p>
          )}
        </div>
      </div>
    </section>
  );
}

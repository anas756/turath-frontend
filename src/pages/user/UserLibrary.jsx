import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import ResourceShelf from '../../components/user/ResourceShelf';
import SectionHeader from '../../components/user/SectionHeader';
import useUserArchiveData from '../../hooks/useUserArchiveData';
import { addDocumentFavorite, removeFavorite } from '../../app/services/reduxTollkit/asyncThunks/FavoriteThunk';
import { api } from '../../app/services/lib/Api';
import {
  fallbackImage,
  getId,
  matchesText,
  resolveAssetUrl,
} from '../../utils/userResources';

const typeFilters = ['All', 'Gutendex', 'Internet Archive', 'Google Books', 'Open Library', 'Document'];

export default function UserLibrary() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('');
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [contentQuery, setContentQuery] = useState('');
  const [contentSearch, setContentSearch] = useState({
    loading: false,
    error: null,
    results: [],
    searched: false,
    message: '',
  });
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

  const handleContentSearch = async (event) => {
    event.preventDefault();
    const value = contentQuery.trim();

    if (!value) {
      setContentSearch({
        loading: false,
        error: null,
        results: [],
        searched: false,
        message: '',
      });
      return;
    }

    setContentSearch((current) => ({
      ...current,
      loading: true,
      error: null,
      searched: true,
    }));

    try {
      const { data } = await api.searchAbookUsingWord(value, { limit: 10 });
      setContentSearch({
        loading: false,
        error: null,
        results: data.data || [],
        searched: true,
        message: data.message || '',
      });
    } catch (error) {
      setContentSearch({
        loading: false,
        error: error.response?.data?.message || 'Search inside books failed.',
        results: [],
        searched: true,
        message: '',
      });
    }
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

        <form className="library-content-search" onSubmit={handleContentSearch}>
          <div>
            <span>Search inside readable books</span>
            <input
              type="search"
              placeholder="Search by a word or sentence from any book..."
              value={contentQuery}
              onChange={(event) => setContentQuery(event.target.value)}
            />
          </div>
          <button type="submit" disabled={contentSearch.loading}>
            {contentSearch.loading ? 'Searching...' : 'Search text'}
          </button>
        </form>
        <p className="library-content-search__hint">
          This searches extracted readable text stored in Turath. Preview-only records are skipped until full text is available.
        </p>

        {contentSearch.searched && (
          <ContentSearchResults search={contentSearch} />
        )}

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

function ContentSearchResults({ search }) {
  if (search.loading) {
    return (
      <div className="library-content-results">
        <p className="user-page-note">Searching readable book text...</p>
      </div>
    );
  }

  if (search.error) {
    return (
      <div className="library-content-results is-error">
        <h3>Search unavailable</h3>
        <p>{search.error}</p>
      </div>
    );
  }

  if (!search.results.length) {
    return (
      <div className="library-content-results">
        <h3>No text matches found</h3>
        <p>
          Try another word or sentence. Some provider records only have preview metadata, not full readable text.
        </p>
      </div>
    );
  }

  return (
    <div className="library-content-results">
      <div className="library-content-results__header">
        <h3>Text matches</h3>
        <span>{search.results.length} books</span>
      </div>
      {search.message && <p className="library-content-results__note">{search.message}</p>}
      <div className="library-content-results__list">
        {search.results.map((result) => {
          const firstMatch = result.matches?.[0];
          const cover = resolveAssetUrl(result.cover_url) || fallbackImage;
          const readerHref = firstMatch?.page_number
            ? `/user/library/${result.document_id}/read?page=${firstMatch.page_number}`
            : `/user/library/${result.document_id}`;

          return (
            <article className="library-content-match" key={result.document_id}>
              <img src={cover} alt="" />
              <div>
                <h4>{result.title || 'Untitled document'}</h4>
                {result.matches?.slice(0, 3).map((match) => (
                  <p key={`${result.document_id}-${match.page_number}`}>
                    <strong>Page {match.page_number}:</strong> {match.snippet}
                  </p>
                ))}
                <Link to={readerHref}>Open matching page</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

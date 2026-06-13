import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setQuery,
  setType,
  clearSearch,
  selectSearch,
} from '../../app/services/reduxTollkit/Slices/SearchSlice';
import { searchContent } from '../../app/services/reduxTollkit/asyncThunks/SearchThunk';

const DEBOUNCE_MS = 420;

const TYPE_OPTIONS = [
  { value: 'all',      label: 'All' },
  { value: 'document', label: 'Documents' },
  { value: 'video',    label: 'Videos' },
];

function SearchIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" className="search-spinner">
      <path d="M12 2a10 10 0 1 0 10 10" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}

function ResultItem({ item, kind }) {
  return (
    <div className="search-result-item">
      <span className="search-result-item__icon">
        {kind === 'document' ? <DocIcon /> : <VideoIcon />}
      </span>
      <div className="search-result-item__body">
        <p className="search-result-item__title">{item.title}</p>
        <span className="search-result-item__badge">
          {kind === 'document' ? 'Document' : item.type || 'Media'}
        </span>
      </div>
      <Link to="/signup" className="search-result-item__cta" aria-label="Unlock access">
        <LockIcon /> Unlock
      </Link>
    </div>
  );
}

export default function SearchContainer() {
  const dispatch   = useDispatch();
  const search     = useSelector(selectSearch);
  const timerRef   = useRef(null);
  const [localQuery, setLocalQuery] = useState('');

  const fireSearch = useCallback(
    (q, type) => {
      if (!q.trim()) { dispatch(clearSearch()); return; }
      dispatch(searchContent({ query: q.trim(), type }));
    },
    [dispatch]
  );

  const handleInput = (e) => {
    const val = e.target.value;
    setLocalQuery(val);
    dispatch(setQuery(val));
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fireSearch(val, search.type), DEBOUNCE_MS);
  };

  const handleTypeChange = (type) => {
    dispatch(setType(type));
    clearTimeout(timerRef.current);
    if (localQuery.trim()) fireSearch(localQuery, type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(timerRef.current);
    fireSearch(localQuery, search.type);
  };

  const handleClear = () => {
    setLocalQuery('');
    dispatch(clearSearch());
  };

  const totalResults = search.results.documents.length + search.results.media.length;
  const hasResults   = search.active && totalResults > 0;
  const noResults    = search.active && !search.loading && totalResults === 0 && localQuery.trim();

  return (
    <div className="search-container">
      {/* Type selector */}
      <div className="search-container__types" role="group" aria-label="Search type">
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`search-type-btn${search.type === opt.value ? ' search-type-btn--active' : ''}`}
            onClick={() => handleTypeChange(opt.value)}
            aria-pressed={search.type === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form className="search-container__bar" onSubmit={handleSubmit} role="search">
        <span className="search-container__bar-icon">
          {search.loading ? <SpinnerIcon /> : <SearchIcon />}
        </span>
        <input
          type="search"
          value={localQuery}
          onChange={handleInput}
          placeholder={
            search.type === 'document' ? 'Search books, PDFs, manuscripts…'
            : search.type === 'video'  ? 'Search videos, audio, recordings…'
            : 'Search documents, videos, and more…'
          }
          aria-label="Search the archive"
          autoComplete="off"
          className="search-container__input"
        />
        {localQuery && (
          <button type="button" className="search-container__clear"
            onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
        <button type="submit" className="search-container__submit">Search</button>
      </form>

      {/* Results panel */}
      {(hasResults || noResults || search.error) && (
        <div className="search-results-panel" role="region" aria-label="Search results">
          {search.error && (
            <p className="search-results-panel__error">
              Search is available to signed-in members.{' '}
              <Link to="/login">Sign in</Link> to unlock full search.
            </p>
          )}

          {noResults && !search.error && (
            <p className="search-results-panel__empty">
              No results for <strong>"{localQuery}"</strong>.{' '}
              <Link to="/signup">Create an account</Link> to access the full archive.
            </p>
          )}

          {hasResults && (
            <>
              <p className="search-results-panel__count">
                {totalResults} preview result{totalResults !== 1 ? 's' : ''} for{' '}
                <strong>"{localQuery}"</strong> — sign in to read &amp; watch
              </p>

              {search.results.documents.length > 0 && (
                <div className="search-results-panel__group">
                  <h4>Documents</h4>
                  {search.results.documents.slice(0, 5).map((doc) => (
                    <ResultItem key={doc._id ?? doc.id} item={doc} kind="document" />
                  ))}
                </div>
              )}

              {search.results.media.length > 0 && (
                <div className="search-results-panel__group">
                  <h4>Media</h4>
                  {search.results.media.slice(0, 5).map((item) => (
                    <ResultItem key={item._id ?? item.id} item={item} kind="media" />
                  ))}
                </div>
              )}

              <div className="search-results-panel__footer">
                <Link to="/signup">Create account to see all results</Link>
                <Link to="/login">Sign in</Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

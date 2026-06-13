import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setQuery,
  setType,
  selectSearchQuery,
  selectSearchType,
} from '../../app/services/reduxTollkit/Slices/SearchSlice';

const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'archive', label: 'Archive' },
  { value: 'watch', label: 'Watch & Listen' },
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

export default function SearchContainer({ initialQuery, initialType }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedQuery = useSelector(selectSearchQuery);
  const storedType = useSelector(selectSearchType);
  const [localQuery, setLocalQuery] = useState(initialQuery ?? storedQuery ?? '');
  const [localType, setLocalType] = useState(initialType ?? storedType ?? 'all');

  useEffect(() => {
    if (initialQuery !== undefined) {
      setLocalQuery(initialQuery);
    }

    if (initialType !== undefined) {
      setLocalType(initialType);
    }
  }, [initialQuery, initialType]);

  const handleTypeChange = (type) => {
    setLocalType(type);
    dispatch(setType(type));
  };

  const handleInput = (event) => {
    const value = event.target.value;
    setLocalQuery(value);
    dispatch(setQuery(value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams({
      q: localQuery.trim() || 'Moroccan heritage',
      type: localType,
    });

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="search-container">
      <div className="search-container__types" role="group" aria-label="Search type">
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`search-type-btn${localType === option.value ? ' search-type-btn--active' : ''}`}
            onClick={() => handleTypeChange(option.value)}
            aria-pressed={localType === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form className="search-container__bar" onSubmit={handleSubmit} role="search">
        <span className="search-container__bar-icon">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={localQuery}
          onChange={handleInput}
          placeholder={
            localType === 'archive'
              ? 'Search books, PDFs, manuscripts...'
              : localType === 'watch'
                ? 'Search videos, audio, recordings...'
                : 'Search documents, videos, and Moroccan heritage...'
          }
          aria-label="Search the archive"
          autoComplete="off"
          className="search-container__input"
        />
        <button type="submit" className="search-container__submit">Search</button>
      </form>
    </div>
  );
}

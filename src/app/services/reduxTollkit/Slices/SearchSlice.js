import { createSlice } from '@reduxjs/toolkit';
import { searchContent } from '../asyncThunks/SearchThunk';

const emptyResults = {
  internal: { documents: [], media: [] },
  external: { youtube: [] },
  counts: { internal: 0, documents: 0, media: 0, external: 0, total: 0 },
};

const initialState = {
  query: '',
  type: 'all',
  results: emptyResults,
  loading: false,
  error: null,
  active: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, { payload }) {
      state.query = payload;
    },
    setType(state, { payload }) {
      state.type = payload;
    },
    clearSearch(state) {
      state.query = '';
      state.results = emptyResults;
      state.error = null;
      state.active = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.active = true;
      })
      .addCase(searchContent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.results = payload ?? emptyResults;
      })
      .addCase(searchContent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { setQuery, setType, clearSearch } = searchSlice.actions;

export const selectSearchQuery = (state) => state.search.query;
export const selectSearchType = (state) => state.search.type;
export const selectSearchResults = (state) => state.search.results;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchError = (state) => state.search.error;
export const selectSearchActive = (state) => state.search.active;
export const selectSearch = (state) => state.search;

export default searchSlice.reducer;

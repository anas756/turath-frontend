import { createSlice } from '@reduxjs/toolkit';
import { searchContent } from '../asyncThunks/SearchThunk';

const initialState = {
  query: '',
  type: 'all', 
  results: {
    documents: [],
    media: [],
  },
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
      state.results = { documents: [], media: [] };
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
        state.results = payload;
      })
      .addCase(searchContent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { setQuery, setType, clearSearch } = searchSlice.actions;

// Selectors
export const selectSearchQuery   = (state) => state.search.query;
export const selectSearchType    = (state) => state.search.type;
export const selectSearchResults = (state) => state.search.results;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchError   = (state) => state.search.error;
export const selectSearchActive  = (state) => state.search.active;

// Combined selector — everything SearchContainer needs in one call
export const selectSearch = (state) => state.search;

export default searchSlice.reducer;

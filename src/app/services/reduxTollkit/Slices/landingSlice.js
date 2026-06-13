import { createSlice } from '@reduxjs/toolkit';
import { fetchLandingPreview } from '../asyncThunks/landingThunk';

const initialState = {
  documents: [],
  media: [],
  collections: { documents: [], media: [] },
  loading: false,
  error: null,
};

export const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandingPreview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandingPreview.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.documents = payload.documents;
        state.media = payload.media;
        state.collections = payload.collections;
      })
      .addCase(fetchLandingPreview.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const selectLandingDocuments = (state) => state.landing.documents;
export const selectLandingMedia = (state) => state.landing.media;
export const selectLandingCollections = (state) => state.landing.collections;
export const selectLandingCollectionDocs = (state) =>
  state.landing.collections.documents;
export const selectLandingCollectionMedia = (state) =>
  state.landing.collections.media;
export const selectLandingLoading = (state) => state.landing.loading;
export const selectLandingError = (state) => state.landing.error;

export default landingSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { fetchLandingPreview } from '../asyncThunks/landingThunk';
import { deleteDoc } from '../asyncThunks/LibraryThunk';
import {
  bulkDeleteMedia,
  deleteMedia,
  updateMediaStatus,
} from '../asyncThunks/MediaThunk';

const initialState = {
  documents: [],
  media: [],
  collections: { categories: [] },
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
        state.documents = payload.documents || [];
        state.media = payload.media || [];
        state.collections = payload.collections || { categories: [] };
      })
      .addCase(fetchLandingPreview.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteDoc.fulfilled, (state, { payload }) => {
        state.documents = state.documents.filter(
          (doc) => (doc._id || doc.id) !== payload
        );
        state.collections.categories = state.collections.categories.map((category) => ({
          ...category,
          documents: (category.documents || []).filter(
            (doc) => (doc._id || doc.id) !== payload
          ),
        }));
      })
      .addCase(deleteMedia.fulfilled, (state, { payload }) => {
        const deletedId = payload.id ?? payload;
        state.media = state.media.filter(
          (item) => (item._id || item.id) !== deletedId
        );
      })
      .addCase(bulkDeleteMedia.fulfilled, (state, { payload }) => {
        const deletedIds = payload.ids ?? payload;
        state.media = state.media.filter(
          (item) => !deletedIds.includes(item._id || item.id)
        );
      })
      .addCase(updateMediaStatus.fulfilled, (state, { payload }) => {
        const updatedMedia = payload.data ?? payload;
        const updatedId = updatedMedia._id || updatedMedia.id;

        if (updatedMedia.status !== 'active') {
          state.media = state.media.filter(
            (item) => (item._id || item.id) !== updatedId
          );
        }
      });
  },
});

export const selectLandingDocuments = (state) => state.landing.documents;
export const selectLandingMedia = (state) => state.landing.media;
export const selectLandingCollections = (state) => state.landing.collections;
export const selectLandingCollectionCategories = (state) =>
  state.landing.collections.categories || [];
export const selectLandingLoading = (state) => state.landing.loading;
export const selectLandingError = (state) => state.landing.error;

export default landingSlice.reducer;

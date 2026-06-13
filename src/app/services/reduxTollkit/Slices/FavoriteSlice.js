import { createSlice } from '@reduxjs/toolkit';
import { addDocumentFavorite, addMediaFavorite, fetchFavorites, removeFavorite } from '../asyncThunks/FavoriteThunk';
const initialState = {
  documents: [],
  media: [],
  counts: {
    document: 0,
    media: 0,
    total: 0,
  },
  loading: false,
  error: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────

export const FavoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetFavorites() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ── fetchFavorites ──────────────────────────────────────────────────────
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.documents = payload.documents.data;
        state.media = payload.media.data;
        state.counts = payload.counts;
      })
      .addCase(fetchFavorites.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── addDocumentFavorite ─────────────────────────────────────────────────
    builder
      .addCase(addDocumentFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDocumentFavorite.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.documents.unshift(payload);
        state.counts.document += 1;
        state.counts.total += 1;
      })
      .addCase(addDocumentFavorite.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── addMediaFavorite ────────────────────────────────────────────────────
    builder
      .addCase(addMediaFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMediaFavorite.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.media.unshift(payload);
        state.counts.media += 1;
        state.counts.total += 1;
      })
      .addCase(addMediaFavorite.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── removeFavorite ──────────────────────────────────────────────────────
    builder
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, { payload }) => {
        state.loading = false;

        if (payload.type === 'document') {
          state.documents = state.documents.filter(
            (f) => f.favorable_id !== payload.favorableId
          );
          state.counts.document -= 1;
        } else {
          state.media = state.media.filter(
            (f) => f.favorable_id !== payload.favorableId
          );
          state.counts.media -= 1;
        }
        state.counts.total -= 1;
      })
      .addCase(removeFavorite.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});
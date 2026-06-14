import { createSlice } from '@reduxjs/toolkit';
import {
  fetchMedia,
  fetchMediaById,
  createMedia,
  updateMediaTunk,
  deleteMedia,
  bulkDeleteMedia,
  updateMediaStatus,
} from '../asyncThunks/MediaThunk'; // Update path as needed

const extractMediaList = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const extractPagination = (payload, fallback) =>
  payload?.pagination ??
  (payload?.data?.current_page
    ? {
        current_page: payload.data.current_page,
        last_page: payload.data.last_page,
        per_page: payload.data.per_page,
        total: payload.data.total,
        from: payload.data.from,
        to: payload.data.to,
      }
    : fallback);

const initialState = {
  media: [],
  currentMedia: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  },
  mediaLoading: false,
  loading: false,
};

export const MediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch All Media ---
      .addCase(fetchMedia.pending, (state) => {
        state.mediaLoading = true;
        state.loading = true;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.mediaLoading = false;
        state.loading = false;
        state.media = extractMediaList(action.payload);
        state.pagination = extractPagination(action.payload, state.pagination);
      })
      .addCase(fetchMedia.rejected, (state) => {
        state.mediaLoading = false;
        state.loading = false;
      })

      // --- Fetch Single Media ---
      .addCase(fetchMediaById.fulfilled, (state, action) => {
        state.currentMedia = action.payload.data ?? action.payload;
        
      })

      // --- Create Media ---
      .addCase(createMedia.fulfilled, (state, action) => {
        const media = action.payload.data ?? action.payload;
        if (media) state.media.unshift(media);
      })

      // --- Update Media ---
      .addCase(updateMediaTunk.fulfilled, (state, action) => {
        const updatedMedia = action.payload.data ?? action.payload;
        const index = state.media.findIndex(
          (m) => (m._id || m.id) === (updatedMedia._id || updatedMedia.id)
        );
        if (index !== -1) state.media[index] = updatedMedia;
      })

      // --- Delete Media ---
      .addCase(deleteMedia.fulfilled, (state, action) => {
        // Assuming action.payload is the ID or contains the ID
        const idToDelete = action.payload.id ?? action.payload;
        state.media = state.media.filter((m) => (m._id || m.id) !== idToDelete);
      })

      // --- Bulk Delete Media ---
      .addCase(bulkDeleteMedia.fulfilled, (state, action) => {
        const idsToDelete = action.payload.ids ?? action.payload;
        state.media = state.media.filter(
          (m) => !idsToDelete.includes(m._id || m.id)
        );
      })

      // --- Update Media Status ---
      .addCase(updateMediaStatus.fulfilled, (state, action) => {
        const updated = action.payload.data ?? action.payload;
        const index = state.media.findIndex(
          (m) => (m._id || m.id) === (updated._id || updated.id)
        );
        if (index !== -1) {
          state.media[index].status = updated.status;
        }
      });
  },
});

export default MediaSlice.reducer;

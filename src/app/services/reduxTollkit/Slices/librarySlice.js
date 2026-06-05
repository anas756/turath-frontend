import { createSlice } from '@reduxjs/toolkit';
import { getAllCategoris, getAllDocs, createDoc, deleteDoc } from '../asyncThunks/LibraryThunk';

const initialState = {
  documents: [],
  categories: [],
  loading: false,
  error: null,
};

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Documents ---
      .addCase(getAllDocs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllDocs.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.data ?? action.payload ?? [];
      })
      .addCase(getAllDocs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // --- Categories ---
      .addCase(getAllCategoris.pending, (state) => { state.loading = true; })
      .addCase(getAllCategoris.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data ?? action.payload ?? [];
      })
      .addCase(getAllCategoris.rejected, (state) => { state.loading = false; })

      // --- Create Doc ---
      .addCase(createDoc.pending, (state) => { state.loading = false; })
      .addCase(createDoc.fulfilled, (state, action) => {
        const doc = action.payload.data ?? action.payload;
        if (doc) state.documents.unshift(doc);
      })
      .addCase(createDoc.rejected, (state, action) => { state.error = action.payload; })

      // --- Delete Doc ---
      .addCase(deleteDoc.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (d) => (d._id || d.id) !== action.payload
        );
      });
  },
});

export default librarySlice.reducer;
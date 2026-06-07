import { createSlice } from '@reduxjs/toolkit';
import {
  getAllCategoris,
  getAllDocs,
  createDoc,
  deleteDoc,
  createCategory, 
  deleteCategory, 
} from '../asyncThunks/LibraryThunk';

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
      .addCase(getAllDocs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDocs.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.data ?? action.payload ?? [];
      })
      .addCase(getAllDocs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Categories ---
      .addCase(getAllCategoris.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategoris.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data ?? action.payload ?? [];
      })
      .addCase(getAllCategoris.rejected, (state) => {
        state.loading = false;
      })

      // --- Create Doc ---
      .addCase(createDoc.fulfilled, (state, action) => {
        const doc = action.payload.data ?? action.payload;
        if (doc) state.documents.unshift(doc);
      })

      // --- Delete Doc ---
      .addCase(deleteDoc.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (d) => (d._id || d.id) !== action.payload
        );
      })

      // --- Create Category ---
      .addCase(createCategory.fulfilled, (state, action) => {
        const cat = action.payload.data ?? action.payload;
        if (cat) state.categories.unshift(cat);
      })

      // --- Delete Category ---
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => (c._id || c.id) !== action.payload
        );
      });
  },
});

export default librarySlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  getAllCategoris,
  getAllDocs,
  createDoc,
  deleteDoc,
  createCategory, 
  deleteCategory, 
} from '../asyncThunks/LibraryThunk';

const defaultPagination = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: null,
  to: null,
};

const extractList = (payload) => {
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
  documents: [],
  categories: [],
  documentsPagination: defaultPagination,
  categoriesPagination: defaultPagination,
  documentsLoading: false,
  categoriesLoading: false,
};

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Documents ---
      .addCase(getAllDocs.pending, (state) => {
        state.documentsLoading = true;
      })
      .addCase(getAllDocs.fulfilled, (state, action) => {
        state.documentsLoading = false;
        state.documents = extractList(action.payload);
        state.documentsPagination = extractPagination(
          action.payload,
          state.documentsPagination
        );
      })
      .addCase(getAllDocs.rejected, (state) => {
        state.documentsLoading = false;
    
      })

      // --- Categories ---
      .addCase(getAllCategoris.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(getAllCategoris.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = extractList(action.payload);
        state.categoriesPagination = extractPagination(
          action.payload,
          state.categoriesPagination
        );
      })
      .addCase(getAllCategoris.rejected, (state) => {
        state.categoriesLoading = false;
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

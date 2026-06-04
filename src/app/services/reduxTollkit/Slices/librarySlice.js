import { createSlice } from '@reduxjs/toolkit';
import { getAllCategoris, getAllDocs } from '../asyncThunks/LibraryThunk';
const initialState = {
  documents: [],
  categories: [],
  loading: false,
};
export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Documents Cases ---
      .addCase(getAllDocs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDocs.fulfilled, (state, action) => {
        state.loading = false;
        state.document = action.payload.data;
      })
      .addCase(getAllDocs.rejected, (state) => {
        state.loading = false;
      })

      // --- Categories Cases ---
      .addCase(getAllCategoris.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategoris.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(getAllCategoris.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default librarySlice.reducer;

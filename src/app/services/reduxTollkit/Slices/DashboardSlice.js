import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardStats } from '../asyncThunks/DashboardThunk';

const initialState = {
  users: {
    total: 0,
    this_month: 0,
    last_month: 0,
    percentage: 0,
    trend: 'up',
  },
  documents: {
    total: 0,
    this_month: 0,
    last_month: 0,
    percentage: 0,
    trend: 'up',
  },
  media: {
    total: 0,
    this_month: 0,
    last_month: 0,
    percentage: 0,
    trend: 'up',
  },
  recent: [],
  loading: false,
  error: null,
};

export const DashboardSlice = createSlice({
  name: 'Dashboard',
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.documents = action.payload.documents;
        state.media = action.payload.media;
        state.recent = action.payload.recent;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDashboard } = DashboardSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectDashboardUsers = (state) => state.dashboard.users;
export const selectDashboardDocuments = (state) => state.dashboard.documents;
export const selectDashboardMedia = (state) => state.dashboard.media;
export const selectDashboardRecent = (state) => state.dashboard.recent;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;

export default DashboardSlice.reducer;

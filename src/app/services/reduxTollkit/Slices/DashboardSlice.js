import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardStats } from '../asyncThunks/DashboardThunk';
const initialState = {
  stats: {
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
  },
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
        state.stats = action.payload;
        console.log(action);
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetDashboard } = DashboardSlice.actions;

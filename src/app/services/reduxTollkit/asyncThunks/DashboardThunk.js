import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/Api';

export const fetchDashboardStats = createAsyncThunk(
  'Dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

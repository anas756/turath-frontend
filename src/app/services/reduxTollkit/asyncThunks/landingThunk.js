import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/Api';

export const fetchLandingPreview = createAsyncThunk(
  'landing/fetchPreview',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.getLandingPreview(params);
      return data.data; // { documents, media }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to fetch landing data.'
      );
    }
  }
);

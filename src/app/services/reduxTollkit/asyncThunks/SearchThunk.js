import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/Api';

export const searchContent = createAsyncThunk(
  'search/searchContent',
  async ({ query, type }, { rejectWithValue }) => {
    try {
      const { data } = await api.searchPublic({ query, type });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Search failed.'
      );
    }
  }
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/Api';



export const fetchFavorites = createAsyncThunk(
  'favorite/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getFavorites();
      return data.data; // { documents, media, counts }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to fetch favorites.'
      );
    }
  }
);

export const addDocumentFavorite = createAsyncThunk(
  'favorite/addDocument',
  async (favorableId, { rejectWithValue }) => {
    try {
      const { data } = await api.addDocumentFavorite(favorableId);
      return data.favorite;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to add document favorite.'
      );
    }
  }
);

export const addMediaFavorite = createAsyncThunk(
  'favorite/addMedia',
  async (favorableId, { rejectWithValue }) => {
    try {
      const { data } = await api.addMediaFavorite(favorableId);
      return data.favorite;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to add media favorite.'
      );
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorite/remove',
  async ({ type, favorableId }, { rejectWithValue }) => {
    try {
      await api.removeFavorite(type, favorableId);
      return { type, favorableId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Failed to remove favorite.'
      );
    }
  }
);

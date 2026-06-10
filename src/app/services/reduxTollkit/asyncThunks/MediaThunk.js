import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/Api';

// ==================== GET ALL MEDIA ====================
export const fetchMedia = createAsyncThunk(
  'media/fetchMedia',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.getMedia(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==================== GET SINGLE MEDIA ====================
export const fetchMediaById = createAsyncThunk(
  'media/fetchMediaById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getMediaById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==================== CREATE MEDIA ====================
export const createMedia = createAsyncThunk(
  'media/createMedia',
  async (mediaData, { rejectWithValue }) => {
    try {
      const response = await api.createMedia(mediaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==================== UPDATE MEDIA ====================
export const updateMedia = createAsyncThunk(
  'media/updateMedia',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateMedia(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==================== DELETE MEDIA ====================
export const deleteMedia = createAsyncThunk(
  'media/deleteMedia',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteMedia(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==================== BULK DELETE MEDIA ====================
export const bulkDeleteMedia = createAsyncThunk(
  'media/bulkDeleteMedia',
  async (ids, { rejectWithValue }) => {
    try {
      const response = await api.bulkDeleteMedia(ids);
      return { ids, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==================== UPDATE MEDIA STATUS ====================
export const updateMediaStatus = createAsyncThunk(
  'media/updateMediaStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.updateMediaStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/Api';

export const getAllDocs = createAsyncThunk(
  'library/docs/all',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getDocs();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch documents'
      );
    }
  }
);

export const getAllCategoris = createAsyncThunk(
  'library/categories/all',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getCategories();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

export const createDoc = createAsyncThunk(
  'library/docs/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createDoc(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create document'
      );
    }
  }
);

export const deleteDoc = createAsyncThunk(
  'library/docs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteDoc(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete document'
      );
    }
  }
);
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
        error.response?.data?.message || 'Registration failed'
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
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

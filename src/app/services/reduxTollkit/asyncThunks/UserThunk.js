import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './../../lib/Api';

export const registerUser = createAsyncThunk(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.register(data);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during login'
      );
    }
  }
);

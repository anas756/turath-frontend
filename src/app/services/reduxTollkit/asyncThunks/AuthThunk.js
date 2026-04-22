import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './../../lib/Api';

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.login(data);

      console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during login'
      );
    }
  }
);

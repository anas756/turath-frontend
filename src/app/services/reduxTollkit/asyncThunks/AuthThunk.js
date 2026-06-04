import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './../../lib/Api';

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.login(data);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during login'
      );
    }
  }
);
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.logout();

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during login'
      );
    }
  }
);
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getProfile();

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during login'
      );
    }
  }
);

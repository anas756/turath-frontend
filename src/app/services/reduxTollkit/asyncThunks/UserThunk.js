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
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const getAllusers = createAsyncThunk(
  'user/all',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getAllUsers();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

export const selectUser = createAsyncThunk(
  'user/selectUser',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.getUser(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateUser({ id, data });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.deleteUser(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

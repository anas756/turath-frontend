import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/Api';

export const getAllDocs = createAsyncThunk(
  'library/docs/all',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.getDocs(params);
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
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.getCategories(params);
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
      console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create document'
      );
    }
  }
);
export const updateDoc = createAsyncThunk(
  'library/docs/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateDoc(id, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to update document'
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

// 2. Create Category
export const createCategory = createAsyncThunk(
  'library/categories/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createCategorie(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create category'
      );
    }
  }
);

// 3. Update Category
export const updateCategory = createAsyncThunk(
  'library/categories/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateCategorie(id, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update category'
      );
    }
  }
);

// 4. Delete Category
export const deleteCategory = createAsyncThunk(
  'library/categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteCategorie(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete category'
      );
    }
  }
);

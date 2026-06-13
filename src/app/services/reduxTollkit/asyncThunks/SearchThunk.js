import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/Api';

export const searchContent = createAsyncThunk(
  'search/searchContent',
  async ({ query, type }, { rejectWithValue }) => {
    try {
      if (type === 'document') {
        const { data } = await api.searchAbookUsingWord(query);
        return { documents: data.data ?? [], media: [] };
      }

      if (type === 'video') {
        const { data } = await api.searchMedia(query);
        return { documents: [], media: data.data ?? [] };
      }

      // type === 'all' — both in parallel, neither failure kills the other
      const [docsRes, mediaRes] = await Promise.allSettled([
        api.searchAbookUsingWord(query),
        api.searchMedia(query),
      ]);

      return {
        documents:
          docsRes.status === 'fulfilled' ? (docsRes.value.data.data ?? []) : [],
        media:
          mediaRes.status === 'fulfilled' ? (mediaRes.value.data.data ?? []) : [],
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Search failed.'
      );
    }
  }
);

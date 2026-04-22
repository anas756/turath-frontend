import { createSlice } from '@reduxjs/toolkit';
import { login } from '../asyncThunks/AuthThunk';

const initialState = {
  user: null,
  jwt_token: null,
  isAuthenticated: false,
  loading: false,
  message: {
    success: null,
    error: null,
  },
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokenFromCookie: (state, action) => {
      state.jwt_token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.jwt_token = null;
      state.isAuthenticated = false;
      state.message.success = null;
      state.message.error = null;

      cookieStore.delete('jwt_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.message.error = null;
        state.message.success = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.jwt_token = action.payload.token;
        state.message.success = action.payload.message;

        cookieStore.set('jwt_token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.message.error = action.payload || 'Login failed';
      });
  },
});

export const { setTokenFromCookie, logout } = AuthSlice.actions;

import { createSlice } from '@reduxjs/toolkit';
import { login } from '../asyncThunks/AuthThunk';
import Cookies from 'js-cookie';

const initialState = {
  user: null,
  jwt_token: null,
  isAuthenticated: false,
  loading: false,
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
      Cookies.remove('jwt_token', { path: '/' });
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN HANDLERS ---
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
        state.jwt_token = action.payload?.token || null;

        if (action.payload?.token) {
          Cookies.set('jwt_token', action.payload.token, {
            expires: 7,
            path: '/',
          });
        }
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { setTokenFromCookie, logout } = AuthSlice.actions;
export default AuthSlice.reducer;

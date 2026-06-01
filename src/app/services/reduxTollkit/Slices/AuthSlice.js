import { createSlice } from '@reduxjs/toolkit';
import { login, getProfile } from '../asyncThunks/AuthThunk';
import Cookies from 'js-cookie';

const initialState = {
  user: null,
  jwt_token: Cookies.get('jwt_token') || null,
  isAuthenticated: !!Cookies.get('jwt_token'),
  isLoading: Cookies.get('jwt_token') ? true : false,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   
    logout: (state) => {
      state.user = null;
      state.jwt_token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      Cookies.remove('jwt_token');
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
      // get profile 
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user; 
        state.isAuthenticated = true;
        state.isLoading = false; 
      })
      .addCase(getProfile.rejected, (state) => {
        state.user = null;
        state.jwt_token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        Cookies.remove('jwt_token'); 
      });
  },
});

export const {  logout } = AuthSlice.actions;
export default AuthSlice.reducer;

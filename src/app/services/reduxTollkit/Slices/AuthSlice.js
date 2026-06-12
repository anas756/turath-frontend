import { createSlice } from '@reduxjs/toolkit';
import { login, getProfile, logout } from '../asyncThunks/AuthThunk';
import Cookies from 'js-cookie';
import { updateUser } from '../asyncThunks/UserThunk';

const USER_FIELDS = [
  'id',
  '_id',
  'name',
  'userName',
  'username',
  'email',
  'role',
  'created_at',
  'joined_at',
  'last_login_at',
];

const isUserLike = (value) =>
  value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  USER_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(value, field));

const getUserId = (user) => user?.id || user?._id;

const normalizeUser = (user) =>
  isUserLike(user)
    ? {
        ...user,
        id: getUserId(user),
      }
    : null;

const extractUpdatedUser = (payload) =>
  [
    payload?.data?.user,
    payload?.user,
    payload?.data,
    payload,
  ].find(isUserLike) || null;

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
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.jwt_token = null;
        state.isAuthenticated = false;
        state.loading = false;
        Cookies.remove('jwt_token');
        localStorage.removeItem('user');
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.jwt_token = null;
        state.isAuthenticated = false;
        Cookies.remove('jwt_token');
        state.error = action.payload || 'Logout failed';
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
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const currentUserId = getUserId(state.user);
        const requestedUserId = action.meta.arg?.id;
        const updatedUser = normalizeUser(extractUpdatedUser(action.payload));
        const updatedUserId = getUserId(updatedUser) || requestedUserId;

        if (!currentUserId || String(updatedUserId) !== String(currentUserId)) return;

        const submittedData = action.meta.arg?.data;
        const fallbackUpdate = isUserLike(submittedData) ? submittedData : null;
        const mergedUser = {
          ...state.user,
          ...(updatedUser || fallbackUpdate),
          id: currentUserId,
        };

        state.user = normalizeUser(mergedUser) || state.user;
      });
  },
});

export const {} = AuthSlice.actions;
export default AuthSlice.reducer;

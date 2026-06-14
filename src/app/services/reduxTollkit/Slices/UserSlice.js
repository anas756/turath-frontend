import { createSlice } from '@reduxjs/toolkit';
import {
  getAllusers,
  registerUser,
  updateUser,
  deleteUser,
} from '../asyncThunks/UserThunk';

const initialState = {
  users: [],
  currentUserSelect: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null,
    to: null,
  },
  loading: false,
};

const USER_FIELDS = ['id', '_id', 'name', 'userName', 'username', 'email', 'role'];

const isUserLike = (value) =>
  value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  USER_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(value, field));

const getUserId = (user) => user?.id || user?._id;

const normalizeUser = (user, fallbackId) =>
  isUserLike(user)
    ? {
        ...user,
        id: getUserId(user) || fallbackId,
      }
    : null;

const extractUpdatedUser = (payload) =>
  [
    payload?.data?.user,
    payload?.user,
    payload?.data,
    payload,
  ].find(isUserLike) || null;

const extractUsers = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const extractPagination = (payload, fallback) =>
  payload?.pagination ??
  (payload?.data?.current_page
    ? {
        current_page: payload.data.current_page,
        last_page: payload.data.last_page,
        per_page: payload.data.per_page,
        total: payload.data.total,
        from: payload.data.from,
        to: payload.data.to,
      }
    : fallback);


export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.currentUserSelect = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllusers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllusers.fulfilled, (state, action) => {
        state.loading = false;
        const rawUsers = extractUsers(action.payload);
        state.users = rawUsers.map(user => ({
          ...user,
          id: user.id || user._id 
        }));
        state.pagination = extractPagination(action.payload, state.pagination);
      })
      .addCase(getAllusers.rejected, (state) => {
        state.loading = false;
      })

      // Register / Store User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload?.data) {
          const newUser = action.payload.data;
          const normalizedUser = {
            ...newUser,
            id: newUser.id || newUser._id
          };
          
          state.users.unshift(normalizedUser); 
        }
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const targetId = action.meta.arg?.id;
        const updatedUser =
          normalizeUser(extractUpdatedUser(action.payload), targetId) ||
          normalizeUser(action.meta.arg?.data, targetId);

        if (updatedUser) {
          state.users = state.users.map((u) =>
            String(u.id) === String(updatedUser.id) || String(u._id) === String(updatedUser.id)
              ? { ...u, ...updatedUser }
              : u
          );
        }
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedUserId = action.meta.arg;
        state.users = state.users.filter((user) => user.id !== deletedUserId && user._id !== deletedUserId);
        if (state.currentUserSelect?.id === deletedUserId || state.currentUserSelect?._id === deletedUserId) {
          state.currentUserSelect = null;
        }
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearSelectedUser } = UserSlice.actions;
export default UserSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  getAllusers,
  registerUser,
  updateUser,
} from '../asyncThunks/UserThunk';
import { deleteUser } from './../asyncThunks/UserThunk';
import { initialState } from './InitialState';

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //  store user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.users.unshift(action.payload.data);
        }
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })

      // fetch all users
      .addCase(getAllusers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllusers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.data || [];
      })
      .addCase(getAllusers.rejected, (state) => {
        state.loading = false;
      })
      // update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        const updatedUser = action.payload?.data;

        if (updatedUser) {
          state.users = state.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          );
        }
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
      })
      // delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedUserId = action.meta.arg;
        state.users = state.users.filter((user) => user.id !== deletedUserId);
        if (state.currentUserSelect?.id === deletedUserId) {
          state.currentUserSelect = null;
        }
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {} = UserSlice.actions;

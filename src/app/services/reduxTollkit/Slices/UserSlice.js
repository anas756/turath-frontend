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
  loading: false,
};


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
        const rawUsers = action.payload?.data || [];
        state.users = rawUsers.map(user => ({
          ...user,
          id: user.id || user._id 
        }));
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
        console.log('register : ', action);
        
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
         console.log('update user : ');
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload?.data;
        if (updatedUser) {
          const normalizedUpdate = {
            ...updatedUser,
            id: updatedUser.id || updatedUser._id
          };
          state.users = state.users.map((u) =>
            (u.id === normalizedUpdate.id || u._id === normalizedUpdate.id) ? normalizedUpdate : u
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

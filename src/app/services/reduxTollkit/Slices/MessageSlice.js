import { createSlice } from '@reduxjs/toolkit';
import { login, logout } from '../asyncThunks/AuthThunk';
import { deleteUser, registerUser, updateUser } from '../asyncThunks/UserThunk';
import { getAllDocs } from '../asyncThunks/LibraryThunk';

const initialState = {
  success: null,
  error: null,
};

export const MessageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.success = null;
      state.error = null;
    },
    setSuccessMessage: (state, action) => {
      state.success = action.payload;

      state.error = null;
    },
    setErrorMessage: (state, action) => {
      state.error = action.payload;

      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'Welcome back!';
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      })
      // logout
      .addCase(logout.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'logout success';
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Account created successfully!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'User updated successfully!';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'User deleted successfully!';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // books
      .addCase(getAllDocs.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'data fetched success!';
      })
      .addCase(getAllDocs.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages, setSuccessMessage, setErrorMessage } =
  MessageSlice.actions;
export default MessageSlice.reducer;

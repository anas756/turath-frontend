import { createSlice } from '@reduxjs/toolkit';
import { login } from '../asyncThunks/AuthThunk';
import { registerUser } from '../asyncThunks/UserThunk';

const initialState = {
  success: null,
  error: null,
};

export const MessageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setSuccessMessage: (state, action) => {
      state.success = action.payload;
      state.error = null;
    },
    setErrorMessage: (state, action) => {
      state.error = action.payload;
      state.success = null;
    },
    clearMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN HANDLERS ---
      .addCase(login.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'Welcome back!';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error =
          action.payload || 'Authentication failed. Please check your inputs.';
        state.success = null;
      })

      // --- REGISTER HANDLERS ---
      .addCase(registerUser.fulfilled, (state, action) => {
        state.success =
          action.payload?.message ||
          'Account created successfully please confirm your email first !!';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error =
          action.payload || 'Registration failed. Please try again.';
        state.success = null;
      });
  },
});

export const { setSuccessMessage, setErrorMessage, clearMessages } =
  MessageSlice.actions;

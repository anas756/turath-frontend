import { createSlice } from '@reduxjs/toolkit';
import { login, logout } from '../asyncThunks/AuthThunk';
import { deleteUser, registerUser, updateUser } from '../asyncThunks/UserThunk';
import {
  createDoc,
  deleteDoc,
  createCategory,
  deleteCategory,
} from '../asyncThunks/LibraryThunk';
import {
  fetchMediaById,
  createMedia,
  updateMediaTunk,
  deleteMedia,
  bulkDeleteMedia,
  updateMediaStatus,
} from '../asyncThunks/MediaThunk';

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
      // ========== AUTHENTICATION ==========
      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'Welcome back!';
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'Logout successful';
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== USERS ==========
      // Register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Account created successfully!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'User updated successfully!';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.success = action.payload?.message || 'User deleted successfully!';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== DOCUMENTS ==========
      // Create Document
      .addCase(createDoc.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Document created successfully!';
      })
      .addCase(createDoc.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create document';
      })

      // Delete Document
      .addCase(deleteDoc.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Document deleted successfully!';
      })
      .addCase(deleteDoc.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete document';
      })

      // ========== CATEGORIES ==========
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Category created successfully!';
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create category';
      })

      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Category deleted successfully!';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete category';
      })

      // ========== MEDIA ==========

      // Fetch Media By ID
      .addCase(fetchMediaById.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Media retrieved successfully';
      })
      .addCase(fetchMediaById.rejected, (state, action) => {
        state.error =
          action.payload?.message || 'Failed to fetch media details';
      })

      // Create Media
      .addCase(createMedia.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Media created successfully!';
      })
      .addCase(createMedia.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to create media';
      })

      // Update Media
      .addCase(updateMediaTunk.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Media updated successfully!';
      })
      .addCase(updateMediaTunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update media';
      })

      // Delete Media
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Media deleted successfully!';
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to delete media';
      })

      // Bulk Delete Media
      .addCase(bulkDeleteMedia.fulfilled, (state, action) => {
        const count = action.payload?.deleted_count || 0;
        state.success =
          action.payload?.message ||
          `${count} media items deleted successfully!`;
      })
      .addCase(bulkDeleteMedia.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to delete media';
      })

      // Update Media Status
      .addCase(updateMediaStatus.fulfilled, (state, action) => {
        state.success =
          action.payload?.message || 'Media status updated successfully!';
      })
      .addCase(updateMediaStatus.rejected, (state, action) => {
        state.error =
          action.payload?.message || 'Failed to update media status';
      });

    
  },
});

export const { clearMessages, setSuccessMessage, setErrorMessage } =
  MessageSlice.actions;
export default MessageSlice.reducer;

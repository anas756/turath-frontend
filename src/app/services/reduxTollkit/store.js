import { configureStore } from '@reduxjs/toolkit';
import { UserSlice } from './Slices/UserSlice';
import { AuthSlice } from './Slices/AuthSlice';
import {  librarySlice } from './Slices/librarySlice';
import { MessageSlice } from './Slices/MessageSlice';

export const store = configureStore({
  reducer: {
    users: UserSlice.reducer,
    auth: AuthSlice.reducer,
    library: librarySlice.reducer,
    message: MessageSlice.reducer,
  },
});

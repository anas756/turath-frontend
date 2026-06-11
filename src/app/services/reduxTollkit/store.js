import { configureStore } from '@reduxjs/toolkit';
import { UserSlice } from './Slices/UserSlice';
import { AuthSlice } from './Slices/AuthSlice';
import { librarySlice } from './Slices/librarySlice';
import { MessageSlice } from './Slices/MessageSlice';
import { MediaSlice } from './Slices/MediaSlice';
import { DashboardSlice } from './Slices/DashboardSlice';

export const store = configureStore({
  reducer: {
    users: UserSlice.reducer,
    auth: AuthSlice.reducer,
    library: librarySlice.reducer,
    media: MediaSlice.reducer,
    dashboard: DashboardSlice.reducer,
    message: MessageSlice.reducer,
  },
});

import { configureStore } from '@reduxjs/toolkit';
import { UserSlice } from './Slices/UserSlice';
import { AuthSlice } from './Slices/AuthSlice';
import { CategorieSlice } from './Slices/Categorie';
import { BookSlice } from './Slices/BookSlice';

export const store = configureStore({
  reducer: {
    users: UserSlice.reducer,
    auth: AuthSlice.reducer,
    categorie: CategorieSlice.reducer,
    book: BookSlice.actions,
  },
});

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  loading: false,
  error: null,
  currentUserProfile: null,
};
export const UserSlice = createSlice({
    name : 'users' ,
  initialState,
  reducers: {},
  extraReducers: () => {},
});

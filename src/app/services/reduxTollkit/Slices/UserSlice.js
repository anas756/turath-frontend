import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  error: null,
  currentUserProfile: null,
};
export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

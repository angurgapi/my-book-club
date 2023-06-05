import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUserState, IUser } from '@/types/user';

const initialState = {
  events: null,
  createdAt: null,
  displayName: null,
  photoURL: null,
  images: null,
  uid: null,
  isAuth: false,
} as IUserState;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.events = action.payload.events || state.events;
      state.createdAt = action.payload.createdAt || state.createdAt;
      state.displayName = action.payload.displayName || state.displayName;
      state.photoURL = action.payload.photoURL || state.photoURL;
      state.images = action.payload.images || state.images;
      state.uid = action.payload.uid || state.uid;
      state.isAuth = action.payload.isAuth || state.isAuth;
    },

    removeUser(state) {
      state.events = null;
      state.createdAt = null;
      state.displayName = null;
      state.photoURL = null;
      state.images = null;
      state.uid = null;
      state.isAuth = false;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export const userReducer = userSlice.reducer;

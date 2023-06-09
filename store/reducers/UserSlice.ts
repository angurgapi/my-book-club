import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUserState, IUser } from '@/types/user';

const initialState = {
  events: [],
  createdAt: '',
  displayName: '',
  email: '',
  photoURL: '',
  uid: '',
  isAuth: false,
} as IUserState;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      console.log(action);
      state.events = action.payload.events || state.events;
      state.createdAt = action.payload.createdAt || state.createdAt;
      state.displayName = action.payload.displayName || state.displayName;
      state.photoURL = action.payload.photoURL || state.photoURL;
      state.uid = action.payload.uid || state.uid;
      state.isAuth = action.payload.isAuth || state.isAuth;
      state.email = action.payload.email || state.email;
    },

    removeUser(state) {
      state.events = [];
      state.createdAt = '';
      state.displayName = '';
      state.photoURL = '';
      state.uid = '';
      state.isAuth = false;
      state.email = '';
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export const userReducer = userSlice.reducer;

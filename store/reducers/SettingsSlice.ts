import { createSlice } from '@reduxjs/toolkit';

import { ISettings } from '@/types/settings';

const preferredTheme =
  window !== undefined &&
  window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';

const initialState = {
  theme: preferredTheme,
  format: 'block',
} as ISettings;

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeLight(state) {
      state.theme = 'light';
    },

    setThemeDark(state) {
      state.theme = 'dark';
    },

    setFormatBlock(state) {
      state.format = 'block';
    },

    setFormatList(state) {
      state.format = 'list';
    },
  },
});

export const { setThemeLight, setThemeDark, setFormatBlock, setFormatList } =
  settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;

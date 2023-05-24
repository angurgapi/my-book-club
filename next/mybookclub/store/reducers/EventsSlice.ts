import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IEvent, IEventsState } from '@/types/event';

const initialState = {
  sortEventsBy: 'newest',
  events: [],
} as IEventsState;

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<IEvent[]>) {
      if (state.sortEventsBy === 'newest') {
        state.events = action.payload.sort(
          (a, b) => +b.createdAt - +a.createdAt
        );
      }

      if (state.sortEventsBy === 'oldest') {
        state.events = action.payload.sort(
          (a, b) => +a.createdAt - +b.createdAt
        );
      }

      if (state.sortEventsBy === 'likes') {
        state.events = action.payload.sort(
          (a, b) => b.likes.length - a.likes.length
        );
      }

      if (state.sortEventsBy === 'controversial') {
        state.events = action.payload.sort(
          (a, b) => b.comments.length - a.comments.length
        );
      }
    },

    removeEvents(state) {
      state.events = [];
    },

    setEventsByNewest(state) {
      state.sortEventsBy = 'newest';
      state.events = state.events.sort((a, b) => +b.createdAt - +a.createdAt);
    },

    setEventsByOldest(state) {
      state.sortEventsBy = 'oldest';
      state.events = state.events.sort((a, b) => +a.createdAt - +b.createdAt);
    },

    setEventsByLikes(state) {
      state.sortEventsBy = 'likes';
      state.events = state.events.sort(
        (a, b) => b.likes.length - a.likes.length
      );
    },

    setEventsByControversial(state) {
      state.sortEventsBy = 'controversial';
      state.events = state.events.sort(
        (a, b) => b.comments.length - a.comments.length
      );
    },
  },
});

export const {
  setEvents,
  removeEvents,
  setEventsByNewest,
  setEventsByOldest,
  setEventsByLikes,
  setEventsByControversial,
} = eventsSlice.actions;

export const eventsReducer = eventsSlice.reducer;

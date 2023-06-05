import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEvent } from '@/types/event';

interface UserEventsState {
  hostedEvents: IEvent[] | null;
  attendedEvents: IEvent[] | null;
}

const initialState: UserEventsState = {
  hostedEvents: null,
  attendedEvents: null,
};
export const userEventsSlice = createSlice({
  name: 'userEvents',
  initialState,
  reducers: {
    setHostedEvents(state, action: PayloadAction<IEvent[]>) {
      state.hostedEvents = action.payload;
    },
    setAttendedEvents(state, action: PayloadAction<IEvent[]>) {
      state.attendedEvents = action.payload;
    },
  },
});

export const { setHostedEvents, setAttendedEvents } = userEventsSlice.actions;

export const userEventsReducer = userEventsSlice.reducer;

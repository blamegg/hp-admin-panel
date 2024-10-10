import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: string;
}

interface CalendarState {
  events: Event[];
}

const initialState: CalendarState = {
  events: [
    { title: "Event 1", start: new Date(), allDay: true, id: "1" },
    { title: "Event 2", start: new Date(), allDay: false, id: "2" },
  ],
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload,
      );
    },
    editEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id,
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
  },
});

export const { addEvent, setEvents, removeEvent, editEvent } =
  calendarSlice.actions;
export default calendarSlice.reducer;

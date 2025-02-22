// src/redux/slices/scheduleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the structure of the schedule state
interface ScheduleState {
  schedule: Record<string, string | null>; // key: 'day-time', value: itinerary item id
  startTime: string; // Start time for the schedule
  interval: number;  // Time interval for the slots
  weekStart: string; // Day of the week that the schedule starts from
}

const initialState: ScheduleState = {
  schedule: {},
  startTime: "08:00",  // Default start time
  interval: 30,        // Default interval in minutes
  weekStart: "Sunday", // Default start day of the week
};

// Create the slice for schedule state
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    // Action to update a schedule slot with an itinerary item
    updateScheduleSlot: (
      state,
      action: PayloadAction<{ slot: string; itineraryItemId: string }>
    ) => {
      const { slot, itineraryItemId } = action.payload;
      state.schedule[slot] = itineraryItemId;
    },
    // Action to remove an item from a schedule slot
    removeScheduleSlot: (state, action: PayloadAction<string>) => {
      delete state.schedule[action.payload];
    },
    // Action to update the start time of the schedule
    setStartTime: (state, action: PayloadAction<string>) => {
      state.startTime = action.payload;
    },
    // Action to update the time interval for the schedule
    setInterval: (state, action: PayloadAction<number>) => {
      state.interval = action.payload;
    },
    // Action to update the start day of the week
    setWeekStart: (state, action: PayloadAction<string>) => {
      state.weekStart = action.payload;
    },
  },
});

export const {
  updateScheduleSlot,
  removeScheduleSlot,
  setStartTime,
  setInterval,
  setWeekStart,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;

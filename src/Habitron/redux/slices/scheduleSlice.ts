import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { AuthState } from "./authSlice";

// Define the structure of the schedule state
interface ScheduleState {
  schedule: Record<string, string | null>; // key: 'day-time', value: itinerary item id
  startTime: string; // Start time for the schedule
  interval: number; // Time interval for the slots
  weekStart: string; // Day of the week that the schedule starts from
}

const API_BASE = import.meta.env.VITE_API_BASE;
const SCHEDULE_URL = `${API_BASE}/api/schedule`;

const initialState: ScheduleState = {
  schedule: {},
  startTime: "08:00", // Default start time
  interval: 30, // Default interval in minutes
  weekStart: "Sunday", // Default start day of the week
};

// Fetch schedule from the backend
export const fetchSchedule = createAsyncThunk(
  "schedule/fetchSchedule",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    try {
      const response = await axios.get(`${SCHEDULE_URL}?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch schedule");
    }
  }
);

// Update a schedule slot
export const updateScheduleSlot = createAsyncThunk(
  "schedule/updateScheduleSlot",
  async (
    { slot, itineraryItemId }: { slot: string; itineraryItemId: string },
    { rejectWithValue, getState }
  ) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    try {
      await axios.put(`${SCHEDULE_URL}?userId=${userId}`, { slot, itineraryItemId });
      return { slot, itineraryItemId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update schedule slot");
    }
  }
);

// Remove a schedule slot
export const removeScheduleSlot = createAsyncThunk(
  "schedule/removeScheduleSlot",
  async (slot: string, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    try {
      await axios.delete(`${SCHEDULE_URL}?userId=${userId}&slot=${slot}`);
      return slot;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to remove schedule slot");
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setStartTime: (state, action: PayloadAction<string>) => {
      state.startTime = action.payload;
    },
    setInterval: (state, action: PayloadAction<number>) => {
      state.interval = action.payload;
    },
    setWeekStart: (state, action: PayloadAction<string>) => {
      state.weekStart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.schedule = action.payload;
      })
      .addCase(updateScheduleSlot.fulfilled, (state, action) => {
        const { slot, itineraryItemId } = action.payload;
        state.schedule[slot] = itineraryItemId;
      })
      .addCase(removeScheduleSlot.fulfilled, (state, action) => {
        delete state.schedule[action.payload];
      });
  },
});

export const { setStartTime, setInterval, setWeekStart } = scheduleSlice.actions;
export default scheduleSlice.reducer;

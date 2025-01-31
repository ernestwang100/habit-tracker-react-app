import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/habitlogs";

// Types
interface HabitCompletion {
  habitId: number;
  completed: boolean;
  streakDays: number;
}

interface DateEntry {
  date: string;
  habitCompletions: HabitCompletion[];
  allHabitsCompleted: boolean;
}

// Async Thunks
export const fetchLogs = createAsyncThunk(
  "dates/fetchLogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch logs");
    }
  }
);

export const addNewDate = createAsyncThunk(
  "dates/addNewDate",
  async (habitCompletions: HabitCompletion[], { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, {
        date: new Date().toISOString().split("T")[0],
        habitCompletions,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add date");
    }
  }
);

export const deleteDate = createAsyncThunk(
  "dates/deleteDate",
  async (date: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${date}`);
      return date;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete date");
    }
  }
);

const datesSlice = createSlice({
  name: "dates",
  initialState: [] as DateEntry[],
  reducers: {
    toggleHabitCompletion: (
      state,
      action: PayloadAction<{ date: string; habitId: number }>
    ) => {
      const { date, habitId } = action.payload;
      const dateEntry = state.find((entry) => entry.date === date);
      if (dateEntry) {
        const habit = dateEntry.habitCompletions.find(h => h.habitId === habitId);
        if (habit) {
          habit.completed = !habit.completed;
          dateEntry.allHabitsCompleted = dateEntry.habitCompletions.every(h => h.completed);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addNewDate.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(deleteDate.fulfilled, (state, action) => {
        return state.filter(entry => entry.date !== action.payload);
      });
  }
});

export const { toggleHabitCompletion } = datesSlice.actions;
export default datesSlice.reducer;

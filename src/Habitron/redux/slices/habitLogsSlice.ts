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
  id: string;
  date: string;
  habitCompletions: HabitCompletion[];
  allHabitsCompleted: boolean;
}

// Async Thunks
export const fetchHabitLogs = createAsyncThunk(
  "habitLogs/fetchHabitLogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch logs");
    }
  }
);

export const addHabitLog = createAsyncThunk(
  "habitLogs/addHabitLog",
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

export const updateLog = createAsyncThunk(
  "habitLogs/updateLog",
  async ({ id, habitCompletions, allHabitsCompleted }: { id: string; habitCompletions: HabitCompletion[]; allHabitsCompleted: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { habitCompletions, allHabitsCompleted });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update log");
    }
  }
);

export const editHabitLogDate = createAsyncThunk(
  "habitLogs/editHabitLogDate",
  async ({ id, date, habitCompletions }: { id: string; date: string, habitCompletions: any[] }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { date, habitCompletions });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update date");
    }
  }
);


export const deleteHabitLog = createAsyncThunk(
  "habitLogs/deleteHabitLog",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete date");
    }
  }
);


const datesSlice = createSlice({
  name: "habitLogs",
  initialState: [] as DateEntry[],
  reducers: {
    toggleHabitCompletion: (
      state,
      action: PayloadAction<{ id: string; habitId: number }>
    ) => {
      const { id, habitId } = action.payload;
      const dateEntry = state.find((entry) => entry.id === id);
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
      .addCase(fetchHabitLogs.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addHabitLog.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(deleteHabitLog.fulfilled, (state, action) => {
        return state.filter(entry => entry.id !== action.payload);
      })
      .addCase(editHabitLogDate.fulfilled, (state, action) => {
        const updatedLog = action.payload;
        const index = state.findIndex((entry) => entry.id === updatedLog.id);
        if (index !== -1) {
          state[index] = updatedLog;
        }
      })
      .addCase(updateLog.fulfilled, (state, action) => {
        const updatedLog = action.payload;
        const index = state.findIndex((entry) => entry.id === updatedLog.id);
        if (index !== -1) {
          state[index] = updatedLog;
        }
      });
  }
});

export const { toggleHabitCompletion } = datesSlice.actions;
export default datesSlice.reducer;

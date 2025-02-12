// habitsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store"; // Ensure you have a proper RootState

// Types
export interface Habit {
  id: number;
  name: string;
  icon: string;
}

export interface HabitCompletion {
  habitId: number;
  completed: boolean;
}

export interface DateEntry {
  date: string;
  habitCompletions: HabitCompletion[];
}

export interface HabitsState {
  habits: Habit[];
  currentHabit: Habit | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// API Configuration
const API_BASE = import.meta.env.VITE_API_BASE;
const HABITS_URL = `${API_BASE}/api/habits`;
const HABIT_LOGS_URL = `${API_BASE}/api/habitlogs`; // Habit Logs API

// Fetch all habits
export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(HABITS_URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch habits");
    }
  }
);

// Add a new habit and update habitLogs to include the new habit
export const addHabit = createAsyncThunk(
  "habits/addHabit",
  async (newHabit: Omit<Habit, "id">, { getState, dispatch, rejectWithValue }) => {
    try {
      // Create new habit
      const response = await axios.post(HABITS_URL, newHabit);
      const habit: Habit = response.data;

      // Get current habit logs from Redux
      const state = getState() as RootState;
      console.log("🔍 Current Redux State:", state); // Debugging step

      // Ensure `habitLogs` exists and has data
      const habitLogs = state.habitLogs.habitLogs;  // Adjust this based on your store structure

      if (!Array.isArray(habitLogs)) {
        console.error("❌ Habit logs is not an array:", habitLogs);
        return rejectWithValue("Invalid habit logs structure in state");
      }

      // Update habit logs to include the new habit
      const updatedLogs = habitLogs.map((log: DateEntry) => ({
        ...log,
        habitCompletions: [...log.habitCompletions, { habitId: habit.id, completed: false }]
      }));

      // Check if the array is still empty before dispatching update
      if (updatedLogs.length === 0) {
        console.warn("⚠️ No habit logs found for update!");
      } else {
        console.log("📦 Updated Habit Logs:", updatedLogs);
        await dispatch(updateAllHabitLogs(updatedLogs));
      }

      return habit;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add habit");
    }
  }
);


// Update an existing habit
export const updateHabit = createAsyncThunk(
  "habits/updateHabit",
  async (updatedHabit: Habit, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${HABITS_URL}/${updatedHabit.id}`, updatedHabit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update habit");
    }
  }
);

// Delete a habit and remove it from habitLogs
export const deleteHabit = createAsyncThunk(
  "habits/deleteHabit",
  async (habitId: number, { getState, dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${HABITS_URL}/${habitId}`);

      // Get current habit logs
      const state = getState() as RootState;
      const updatedLogs = state.habitLogs.map((log: DateEntry) => ({
        ...log,
        habitCompletions: log.habitCompletions.filter(h => h.habitId !== habitId)
      }));

      // Update habit logs after deletion
      await dispatch(updateAllHabitLogs(updatedLogs));
      return habitId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete habit");
    }
  }
);

// Update all habit logs in the backend
export const updateAllHabitLogs = createAsyncThunk(
  "habitLogs/updateAllHabitLogs",
  async (updatedLogs: DateEntry[], { rejectWithValue }) => {
    console.log("🚀 Dispatching batch update for habit logs"); // Log when it's triggered
    console.log("📦 Logs to update:", updatedLogs); // Log data before sending

    try {
      const response = await axios.put(`${HABIT_LOGS_URL}/batchUpdate`, updatedLogs);
      console.log("✅ Batch update success:", response.data); // Log successful response
      return updatedLogs;
    } catch (error: any) {
      console.error("❌ Failed to update habit logs:", error.response?.data || error); // Log error
      return rejectWithValue(error.response?.data || "Failed to update logs");
    }
  }
);


// Initial State
const initialState: HabitsState = {
  habits: [],
  currentHabit: null,
  status: "idle",
  error: null
};

// Slice
const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setCurrentHabit: (state, action: PayloadAction<Habit | null>) => {
      state.currentHabit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Habits
      .addCase(fetchHabits.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Add Habit
      .addCase(addHabit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addHabit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.habits.unshift(action.payload);
      })
      .addCase(addHabit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Update Habit
      .addCase(updateHabit.fulfilled, (state, action) => {
        const index = state.habits.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
        state.currentHabit = null;
      })
      // Delete Habit
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter(h => h.id !== action.payload);
        if (state.currentHabit?.id === action.payload) {
          state.currentHabit = null;
        }
      });
  }
});

export const { setCurrentHabit, clearError } = habitsSlice.actions;
export default habitsSlice.reducer;

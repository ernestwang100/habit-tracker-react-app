// habitsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState } from "./authSlice";

// Types
export interface Habit {
  id: number;
  name: string;
  icon: string;
  userId: string;
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
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue("User ID is missing");

    try {
      const response = await axios.get(`${HABITS_URL}?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch habits");
    }
  }
);

// Add a new habit and update habitLogs
export const addHabit = createAsyncThunk(
  "habits/addHabit",
  async (newHabit: Omit<Habit, "id" | "userId">, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { auth: AuthState; habitLogs: { habitLogs: DateEntry[] } };
    const userId = state.auth.user?.id;

    if (!userId) return rejectWithValue("User ID is missing");

    try {
      // Ensure userId is included in the request
      const habitWithUserId = { ...newHabit, userId };

      // Create the habit
      const response = await axios.post(`${HABITS_URL}`, habitWithUserId);
      const habit: Habit = response.data;

      // Get existing habit logs
      const habitLogs = state.habitLogs.habitLogs;
      if (!Array.isArray(habitLogs)) {
        console.error("Invalid habit logs structure:", habitLogs);
        return rejectWithValue("Invalid habit logs structure in state");
      }

      // Update habit logs
      const updatedLogs = habitLogs.map((log: DateEntry) => ({
        ...log,
        habitCompletions: [...log.habitCompletions, { habitId: habit.id, completed: false }]
      }));

      if (updatedLogs.length > 0) {
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
  async (updatedHabit: Habit, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue("User ID is missing");

    try {
      const response = await axios.put(`${HABITS_URL}/${updatedHabit.id}?userId=${userId}`, updatedHabit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update habit");
    }
  }
);

// Delete a habit and update habit logs
export const deleteHabit = createAsyncThunk(
  "habits/deleteHabit",
  async (habitId: number, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { auth: AuthState; habitLogs: { habitLogs: DateEntry[] } };
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue("User ID is missing");

    try {
      await axios.delete(`${HABITS_URL}/${habitId}?userId=${userId}`);

      // Update habit logs
      const logsArray = state.habitLogs.habitLogs;
      const updatedLogs = logsArray.map((log: DateEntry) => ({
        ...log,
        habitCompletions: log.habitCompletions.filter(h => h.habitId !== habitId)
      }));

      await dispatch(updateAllHabitLogs(updatedLogs));

      return habitId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete habit");
    }
  }
);

// Update all habit logs
export const updateAllHabitLogs = createAsyncThunk(
  "habitLogs/updateAllHabitLogs",
  async (updatedLogs: DateEntry[], { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue("User ID is missing");

    try {
      await axios.put(`${HABIT_LOGS_URL}/batchUpdate?userId=${userId}`, updatedLogs);
      return updatedLogs;
    } catch (error: any) {
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
      .addCase(fetchHabits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addHabit.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        const index = state.habits.findIndex(h => h.id === action.payload.id);
        if (index !== -1) state.habits[index] = action.payload;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter(h => h.id !== action.payload);
      });
  }
});

export const { setCurrentHabit, clearError } = habitsSlice.actions;
export default habitsSlice.reducer;

// habitsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Types
export interface Habit {
  id: number;
  name: string;
  icon: string;
}

export interface HabitsState {
  habits: Habit[];
  currentHabit: Habit | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// API Configuration
const API_URL = "http://localhost:4000/api/habits";

// Async Thunks
export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch habits');
    }
  }
);

export const addHabit = createAsyncThunk(
  'habits/addHabit',
  async (newHabit: Omit<Habit, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, newHabit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to add habit');
    }
  }
);

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async (updatedHabit: Habit, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${updatedHabit.id}`, updatedHabit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update habit');
    }
  }
);

export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async (habitId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${habitId}`);
      return habitId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete habit');
    }
  }
);

// Initial State
const initialState: HabitsState = {
  habits: [],
  currentHabit: null,
  status: 'idle',
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
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add Habit
      .addCase(addHabit.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addHabit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.habits.unshift(action.payload);
      })
      .addCase(addHabit.rejected, (state, action) => {
        state.status = 'failed';
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
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {AuthState} from "./authSlice";
const API_BASE = import.meta.env.VITE_API_BASE;
const HABIT_LOGS_URL = `${API_BASE}/api/habitlogs`;

// Types
interface HabitCompletion {
  habitId: number;
  completed: boolean;
}

interface DateEntry {
  id: string;
  date: string;
  userId: string;
  habitCompletions: HabitCompletion[];
  allHabitsCompleted: boolean;
  streakDays: number;
}


// 🔹 Calculate streaks based on sorted habit logs
const calculateStreaks = (logs: DateEntry[]): DateEntry[] => {
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let streak = 0;

  return sortedLogs.map((entry, index) => {
    if (index > 0 && new Date(entry.date).getTime() - new Date(sortedLogs[index - 1].date).getTime() === 86400000) {
      streak = entry.allHabitsCompleted ? streak + 1 : 0;
    } else {
      streak = entry.allHabitsCompleted ? 0 : 0;
    }
    return { ...entry, streakDays: streak };
  });
};

// Async Thunks
export const fetchHabitLogs = createAsyncThunk(
  "habitLogs/fetchHabitLogs",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id; // Use optional chaining in case user is null

    try {
      const response = await axios.get(`${HABIT_LOGS_URL}?userId=${userId}`);
      return calculateStreaks(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch logs");
    }
  }
);


export const addHabitLog = createAsyncThunk(
  "habitLogs/addHabitLog",
  async (habitCompletions: HabitCompletion[], { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState, habitLogs: { habitLogs: DateEntry[] } };
    const userId = state.auth.user?.id; 
    const logsArray = state.habitLogs.habitLogs;

    try {
      const newLog = {
        date: new Date().toISOString().split("T")[0],
        userId,
        habitCompletions,
        allHabitsCompleted: habitCompletions.every((h) => h.completed),
        streakDays: 0,
      };

      const response = await axios.post(`${HABIT_LOGS_URL}?userId=${userId}`, newLog);
      const updatedLogs = calculateStreaks([...logsArray, response.data]);

      return updatedLogs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add date");
    }
  }
);



export const updateLog = createAsyncThunk(
  "habitLogs/updateLog",
  async (
    dateEntry: DateEntry, // Accept the whole DateEntry object as argument
    { rejectWithValue, getState }
  ) => {
    const state = getState() as { auth: { user: { id: string } | null }; habitLogs: { habitLogs: DateEntry[] } };
    const userId = state.auth.user?.id;
    const logsArray = state.habitLogs.habitLogs;
    console.log("🌟 Extracted habitLogs array:", logsArray);

    if (!userId) {
      return rejectWithValue("User ID is required");
    }

    console.log("🚀 updateLog called with:", dateEntry);

    try {
      // Send the whole DateEntry object to the server
      const response = await axios.put(`${HABIT_LOGS_URL}/${dateEntry.id}`, {
        ...dateEntry, // Spread the whole DateEntry object
        userId, // Ensure userId is included
      });

      console.log("✅ Response received:", response.data);

      // Update the local state with the new data after successful response
      const updatedLogs = logsArray.map((log) =>
        log.id === dateEntry.id
          ? { ...log, ...dateEntry } // Spread the updated DateEntry back into the state
          : log
      );

      return calculateStreaks(updatedLogs); // 🔹 Recalculate streaks

    } catch (error: any) {
      console.error("❌ Error updating log:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update log");
    }
  }
);

export const deleteHabitLog = createAsyncThunk(
  "habitLogs/deleteHabitLog",
  async (id: string, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState; habitLogs: { habitLogs: DateEntry[] } };
    const userId = state.auth.user?.id; 
    const logsArray = state.habitLogs.habitLogs; // Extract the actual array

    if (!userId) {
      return rejectWithValue("User ID is required");
    }

    try {


      await axios.delete(`${HABIT_LOGS_URL}/${id}`, { data: { userId } });

      const updatedLogs = logsArray.filter((entry) => entry.id !== id);
      return calculateStreaks(updatedLogs);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete date");
    }
  }
);

const initialState = {
  habitLogs: [] as DateEntry[],
};

const habitLogsSlice = createSlice({
  name: "habitLogs",
  initialState,
  reducers: {
    toggleHabitCompletion: (state, action: PayloadAction<{ id: string; habitId: number }>) => {
      state.habitLogs = calculateStreaks(
        state.habitLogs.map((entry) =>
          entry.id === action.payload.id
            ? {
                ...entry,
                habitCompletions: entry.habitCompletions.map((h) =>
                  h.habitId === action.payload.habitId ? { ...h, completed: !h.completed } : h
                ),
                allHabitsCompleted: entry.habitCompletions.every((h) => h.completed),
              }
            : entry
        )
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabitLogs.fulfilled, (state, action) => {
        console.log("Fetched habit logs:", action.payload);
        state.habitLogs = action.payload;
      })
      .addCase(addHabitLog.fulfilled, (state, action) => {
        console.log("Added habit log, new state:", action.payload);
        state.habitLogs = action.payload;
      })
      .addCase(updateLog.fulfilled, (state, action) => {
        console.log("Updated habit log, new state:", action.payload);
        state.habitLogs = action.payload;
      })
      .addCase(deleteHabitLog.fulfilled, (state, action) => {
        console.log("Deleted log, new state:", action.payload);
        state.habitLogs = action.payload;
      });
  },
  
});


export const { toggleHabitCompletion } = habitLogsSlice.actions;
export default habitLogsSlice.reducer;

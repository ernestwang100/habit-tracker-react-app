import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;
const HABIT_LOGS_URL = `${API_BASE}/api/habitlogs`;

// Types
interface HabitCompletion {
  habitId: number;
  completed: boolean;
}

interface DateEntry {
  id: string;
  date: string;
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(HABIT_LOGS_URL);
      return calculateStreaks(response.data); // 🔹 Ensure streaks are calculated on fetch
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch logs");
    }
  }
);

export const addHabitLog = createAsyncThunk(
  "habitLogs/addHabitLog",
  async (habitCompletions: HabitCompletion[], { rejectWithValue, getState }) => {
    try {
      const state = getState() as { habitLogs: { habitLogs: DateEntry[] } };
      const logsArray = state.habitLogs.habitLogs; // Extract the actual array
      const newLog = {
        date: new Date().toISOString().split("T")[0],
        habitCompletions,
        allHabitsCompleted: habitCompletions.every((h) => h.completed),
        streakDays: 0, // Default before calculation
      };

      const response = await axios.post(HABIT_LOGS_URL, newLog);
      const updatedLogs = calculateStreaks([...logsArray, response.data]);

      return updatedLogs; // 🔹 Return the entire updated state
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add date");
    }
  }
);


export const updateLog = createAsyncThunk(
  "habitLogs/updateLog",
  async ({ id, habitCompletions, allHabitsCompleted }: { id: string; habitCompletions: HabitCompletion[]; allHabitsCompleted: boolean }, { rejectWithValue, getState }) => {
    console.log("🚀 updateLog called with:", id, habitCompletions, allHabitsCompleted);

    try {
      const state = getState() as { habitLogs: { habitLogs: DateEntry[] } };
      const logsArray = state.habitLogs.habitLogs; // Extract the actual array

      console.log("🌟 Extracted habitLogs array:", logsArray);

      if (!Array.isArray(logsArray)) {
        console.error("❌ Extracted state.habitLogs.habitLogs is not an array:", logsArray);
        return rejectWithValue("Invalid state: habitLogs.habitLogs is not an array");
      }
      
      const response = await axios.put(`${HABIT_LOGS_URL}/${id}`, {
        habitCompletions,
        allHabitsCompleted,
      });
      console.log("✅ Response received:", response.data);
      const updatedLogs = logsArray.map((log) =>
        log.id === id ? { ...log, habitCompletions, allHabitsCompleted } : log
      );

      return calculateStreaks(updatedLogs); // 🔹 Recalculate streaks
    } catch (error: any) {
      console.error("❌ Error updating log:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update log");
    }
  }
);

export const editHabitLogDate = createAsyncThunk(
  "habitLogs/editHabitLogDate",
  async ({ id, date, habitCompletions }: { id: string; date: string; habitCompletions: any[] }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { habitLogs: { habitLogs: DateEntry[] } };
      const logsArray = state.habitLogs.habitLogs; // Extract the actual array

      const response = await axios.put(`${HABIT_LOGS_URL}/${id}`, { date, habitCompletions });

      const updatedLogs = logsArray.map((log) =>
        log.id === id ? { ...log, date, habitCompletions } : log
      );

      return calculateStreaks(updatedLogs);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update date");
    }
  }
);

export const deleteHabitLog = createAsyncThunk(
  "habitLogs/deleteHabitLog",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { habitLogs: { habitLogs: DateEntry[] } };
      const logsArray = state.habitLogs.habitLogs; // Extract the actual array

      await axios.delete(`${HABIT_LOGS_URL}/${id}`);

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
      .addCase(editHabitLogDate.fulfilled, (state, action) => {
        console.log("Edited log date, new state:", action.payload);
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

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/habitlogs";

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
      const response = await axios.get(API_URL);
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
      const state = getState() as { habitLogs: DateEntry[] };
      const newLog = {
        date: new Date().toISOString().split("T")[0],
        habitCompletions,
        allHabitsCompleted: habitCompletions.every((h) => h.completed),
        streakDays: 0, // Default before calculation
      };

      const response = await axios.post(API_URL, newLog);
      const updatedLogs = calculateStreaks([...state.habitLogs, response.data]);

      return updatedLogs; // 🔹 Return the entire updated state
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add date");
    }
  }
);


export const updateLog = createAsyncThunk(
  "habitLogs/updateLog",
  async ({ id, habitCompletions, allHabitsCompleted }: { id: string; habitCompletions: HabitCompletion[]; allHabitsCompleted: boolean }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { habitLogs: DateEntry[] };

      const response = await axios.put(`${API_URL}/${id}`, {
        habitCompletions,
        allHabitsCompleted,
      });

      const updatedLogs = state.habitLogs.map((log) =>
        log.id === id ? { ...log, habitCompletions, allHabitsCompleted } : log
      );

      return calculateStreaks(updatedLogs); // 🔹 Recalculate streaks
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update log");
    }
  }
);

export const editHabitLogDate = createAsyncThunk(
  "habitLogs/editHabitLogDate",
  async ({ id, date, habitCompletions }: { id: string; date: string; habitCompletions: any[] }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { habitLogs: DateEntry[] };

      const response = await axios.put(`${API_URL}/${id}`, { date, habitCompletions });

      const updatedLogs = state.habitLogs.map((log) =>
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
      const state = getState() as { habitLogs: DateEntry[] };
      await axios.delete(`${API_URL}/${id}`);

      const updatedLogs = state.habitLogs.filter((entry) => entry.id !== id);
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
        state.habitLogs = action.payload;
      })
      .addCase(addHabitLog.fulfilled, (state, action) => {
        state.habitLogs = action.payload;
      })
      .addCase(updateLog.fulfilled, (state, action) => {
        state.habitLogs = action.payload;
      })
      .addCase(editHabitLogDate.fulfilled, (state, action) => {
        state.habitLogs = action.payload;
      })
      .addCase(deleteHabitLog.fulfilled, (state, action) => {
        state.habitLogs = action.payload;
      });
  },
});


export const { toggleHabitCompletion } = habitLogsSlice.actions;
export default habitLogsSlice.reducer;

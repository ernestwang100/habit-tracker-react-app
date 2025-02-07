import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./slices/habitsSlice";
import habitLogsReducer from "./slices/habitLogsSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    habitLogs: habitLogsReducer,
  },
});

// Types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

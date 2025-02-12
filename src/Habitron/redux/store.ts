import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./slices/habitsSlice";
import habitLogsReducer from "./slices/habitLogsSlice";
import colorReducer from "./slices/colorSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    habitLogs: habitLogsReducer,
    colors: colorReducer,
  },
});

// Types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

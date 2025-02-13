import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./slices/habitsSlice";
import habitLogsReducer from "./slices/habitLogsSlice";
import colorReducer from "./slices/colorSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    habitLogs: habitLogsReducer,
    colors: colorReducer,
    users: authReducer,
  },
});

// Types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

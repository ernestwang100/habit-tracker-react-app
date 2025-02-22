import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./slices/habitsSlice";
import habitLogsReducer from "./slices/habitLogsSlice";
import colorReducer from "./slices/colorSlice";
import authReducer from "./slices/authSlice";
import itineraryReducer from "./slices/itinerarySlice";
import scheduleReducer from "./slices/scheduleSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    habitLogs: habitLogsReducer,
    colors: colorReducer,
    auth: authReducer,
    itinerary: itineraryReducer,
    schedule: scheduleReducer,
  },
});

// Types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

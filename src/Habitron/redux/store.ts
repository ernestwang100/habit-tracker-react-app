import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./slices/habitsSlice";
import datesReducer from "./slices/datesSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    dates: datesReducer,
  },
});

// Types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

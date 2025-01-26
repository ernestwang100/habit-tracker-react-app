import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Habit {
  id: number;
  name: string;
  icon: string;
}

const initialState: Habit[] = [
  { id: 1, name: "Exercise", icon: "🏃" },
  { id: 2, name: "Read", icon: "📚" },
  { id: 3, name: "Meditate", icon: "🧘" },
  { id: 4, name: "Drink Water", icon: "💧" },
];

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {},
});

export default habitsSlice.reducer;

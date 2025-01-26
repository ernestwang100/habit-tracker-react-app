import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HabitCompletion {
  habitId: number;
  completed: boolean;
  streakDays: number;
}

interface DateEntry {
  date: string;
  habitCompletions: HabitCompletion[];
  allHabitsCompleted: boolean;
}

const initialState: DateEntry[] = [
  {
    date: "2025-01-22",
    habitCompletions: [
      { habitId: 1, completed: false, streakDays: 0 },
      { habitId: 2, completed: false, streakDays: 0 },
      { habitId: 3, completed: false, streakDays: 0 },
      { habitId: 4, completed: false, streakDays: 0 },
    ],
    allHabitsCompleted: false,
  },
  {
    date: "2025-01-21",
    habitCompletions: [
      { habitId: 1, completed: false, streakDays: 0 },
      { habitId: 2, completed: false, streakDays: 0 },
      { habitId: 3, completed: false, streakDays: 0 },
      { habitId: 4, completed: false, streakDays: 0 },
    ],
    allHabitsCompleted: false,
  },
];

const datesSlice = createSlice({
  name: "dates",
  initialState,
  reducers: {
    toggleHabitCompletion: (
      state,
      action: PayloadAction<{ dateIndex: number; habitId: number }>
    ) => {
      const { dateIndex, habitId } = action.payload;
      const habitCompletion = state[dateIndex].habitCompletions.find(
        (completion) => completion.habitId === habitId
      );
      if (habitCompletion) {
        habitCompletion.completed = !habitCompletion.completed;

        // Update streakDays and allHabitsCompleted if needed
        const allCompleted = state[dateIndex].habitCompletions.every(
          (habit) => habit.completed
        );
        state[dateIndex].allHabitsCompleted = allCompleted;
      }
    },
    deleteRow: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1); // Remove the row
    },
    addNewDate: (state) => {
      const newDate = {
        date: new Date().toLocaleDateString(),
        habitCompletions: state[0]?.habitCompletions.map((habit) => ({
          ...habit,
          completed: false,
          streakDays: 0,
        })),
        allHabitsCompleted: false,
      };
      state.push(newDate);
    },
    editDate: (state, action: PayloadAction<{ index: number; newDate: string }>) => {
      const { index, newDate } = action.payload;
      state[index].date = newDate;
    },
  },
});

export const { toggleHabitCompletion, deleteRow, addNewDate, editDate } =
  datesSlice.actions;
export default datesSlice.reducer;

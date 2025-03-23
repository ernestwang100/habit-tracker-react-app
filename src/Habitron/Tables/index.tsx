import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import * as habitLogsSlice from "../redux/slices/habitLogsSlice";
import { RootState } from "../redux/store";
import { Trash2 } from "lucide-react";

export const useAppDispatch = () => useDispatch<AppDispatch>();

function HabitTrackerTable() {
  const dispatch = useAppDispatch();
  const habits = useSelector((state: RootState) => state.habits.habits);
  const habitLogs = useSelector(
    (state: RootState) => state.habitLogs.habitLogs
  );
  const userId = useSelector((state: RootState) => state.auth.user?.id); // Get userId from Redux

  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        dispatch(habitLogsSlice.fetchHabitLogs());
        clearInterval(interval);
      }
    }, 1000); // Retry every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, [userId, dispatch]);

  const handleDateChange = (dateEntryId: string, newDate: string) => {
    const dateEntry = habitLogs.find((entry) => entry.id === dateEntryId);
    if (!dateEntry) return;

    dispatch(habitLogsSlice.updateLog({ ...dateEntry, date: newDate }));
  };

  const handleAllHabitsCompletionChange = (
    dateEntryId: string,
    newStatus: boolean
  ) => {
    const dateEntry = habitLogs.find((entry) => entry.id === dateEntryId);
    if (!dateEntry) return;

    dispatch(
      habitLogsSlice.updateLog({
        ...dateEntry,
        habitCompletions: dateEntry.habitCompletions.map((habit) => ({
          ...habit,
          completed: newStatus,
        })),
        allHabitsCompleted: newStatus,
      })
    );
  };

  const handleHabitCompletionChange = (
    dateEntryId: string,
    habitId: number
  ) => {
    const dateEntry = habitLogs.find((entry) => entry.id === dateEntryId);
    if (!dateEntry) return console.warn(`No log found for id ${dateEntryId}`);

    const updatedHabitCompletions = dateEntry.habitCompletions.map((habit) =>
      habit.habitId === habitId
        ? { ...habit, completed: !habit.completed }
        : habit
    );

    dispatch(
      habitLogsSlice.updateLog({
        ...dateEntry,
        habitCompletions: updatedHabitCompletions,
        allHabitsCompleted: updatedHabitCompletions.every((h) => h.completed),
      })
    );
  };

  const sortedHabitLogs = [...habitLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-4xl overflow-x-auto">
      <button
        onClick={() =>
          dispatch(
            habitLogsSlice.addHabitLog(
              habits.map((h) => ({
                habitId: h.id,
                completed: false,
                streakDays: 0,
              }))
            )
          )
        }
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add New Date
      </button>
      <table className="w-full min-w-max table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Σ</th>
            <th className="px-4 py-2">Day</th>
            {habits.map((habit) => (
              <th key={habit.id} className="px-4 py-2">
                {habit.name}
                {habit.icon}
              </th>
            ))}
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedHabitLogs.map((dateEntry, index) => (
            <tr key={index} className="border-b">
              <td>
                <input
                  type="checkbox"
                  checked={Boolean(dateEntry.allHabitsCompleted)}
                  onChange={() =>
                    handleAllHabitsCompletionChange(
                      dateEntry.id,
                      !dateEntry.allHabitsCompleted
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="date"
                  value={dateEntry.date}
                  onChange={(e) =>
                    handleDateChange(dateEntry.id, e.target.value)
                  }
                />
              </td>
              {habits.map((habit) => (
                <td key={habit.id}>
                  <input
                    type="checkbox"
                    checked={Boolean(
                      dateEntry.habitCompletions?.find(
                        (h) => h.habitId === habit.id
                      )?.completed
                    )}
                    onChange={() =>
                      handleHabitCompletionChange(dateEntry.id, habit.id)
                    }
                  />
                </td>
              ))}

              <td>
                <button
                  onClick={() =>
                    dispatch(habitLogsSlice.deleteHabitLog(dateEntry.id))
                  }
                >
                  <Trash2
                    size={18}
                    className="text-red-500 hover:text-red-700"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HabitTrackerTable;

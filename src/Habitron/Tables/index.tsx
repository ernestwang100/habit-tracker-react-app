import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  fetchLogs,
  addNewDate,
  deleteDate,
  toggleHabitCompletion,
} from "../redux/slices/datesSlice";
import { RootState } from "../redux/store";
import { Trash2 } from "lucide-react";

export const useAppDispatch = () => useDispatch<AppDispatch>();

function HabitTrackerTable() {
  const dispatch = useAppDispatch();
  const habits = useSelector((state: RootState) => state.habits.habits);
  const dates = useSelector((state: RootState) => state.dates);

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  return (
    <div className="max-w-4xl overflow-x-auto">
      <button
        onClick={() =>
          dispatch(
            addNewDate(
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
          {dates.map((dateEntry, index) => (
            <tr key={index} className="border-b">
              <td>
                <input
                  type="checkbox"
                  checked={dateEntry.allHabitsCompleted}
                  readOnly
                />
              </td>
              <td>{dateEntry.date}</td>
              {habits.map((habit) => (
                <td key={habit.id}>
                  <input
                    type="checkbox"
                    checked={
                      !!dateEntry.habitCompletions.find(
                        (h) => h.habitId === habit.id
                      )?.completed
                    }
                    onChange={() =>
                      dispatch(
                        toggleHabitCompletion({
                          id: dateEntry.id,
                          habitId: habit.id,
                        })
                      )
                    }
                  />
                </td>
              ))}
              <td>
                <button onClick={() => dispatch(deleteDate(dateEntry.id))}>
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

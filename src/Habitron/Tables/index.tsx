import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import {
  toggleHabitCompletion,
  deleteRow,
  addNewDate,
  editDate,
} from "../redux/slices/datesSlice";
import { Trash2 } from "lucide-react";

function HabitTrackerTable() {
  const dispatch = useDispatch();
  const habits = useSelector((state: RootState) => state.habits);
  const dates = useSelector((state: RootState) => state.dates);

  const handleHabitToggle = (dateIndex: number, habitId: number) => {
    dispatch(toggleHabitCompletion({ dateIndex, habitId }));
  };

  const handleDeleteRow = (index: number) => {
    dispatch(deleteRow(index));
  };

  const handleAddNewDate = () => {
    dispatch(addNewDate());
  };

  return (
    <div className="max-w-4xl overflow-x-auto">
      <button
        onClick={handleAddNewDate}
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
          {dates.map((dateEntry, dateIndex) => (
            <tr key={dateIndex} className="border-b">
              <td>
                <input
                  type="checkbox"
                  checked={dateEntry.allHabitsCompleted}
                  readOnly
                />
              </td>
              <td>{dateEntry.date}</td>
              {habits.map((habit) => {
                const completion = dateEntry.habitCompletions.find(
                  (comp) => comp.habitId === habit.id
                );
                return (
                  <td key={habit.id}>
                    <input
                      type="checkbox"
                      checked={completion?.completed || false}
                      onChange={() => handleHabitToggle(dateIndex, habit.id)}
                    />
                  </td>
                );
              })}
              <td>
                <button
                  onClick={() => handleDeleteRow(dateIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
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

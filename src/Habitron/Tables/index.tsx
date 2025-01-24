import React, { useState, useEffect } from "react";
import HabitToggle from "./HabitToggle"; // Assuming it's in the same directory
import db from "../database"; // The initial habit and date data
import { Trash2 } from "lucide-react"; // Import a delete icon from Lucide

function HabitTrackerTable() {
  const [habits] = useState(db.habits);
  const [dates, setDates] = useState(db.dates);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editedDate, setEditedDate] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && !target.closest(".date-column-edit")) {
        setEditingDate(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateStreaks = (updatedDates) => {
    return updatedDates.map((dateEntry, index) => {
      const updatedHabitCompletions = dateEntry.habitCompletions.map(
        (habitCompletion, habitIndex) => {
          if (
            index === 0 ||
            !updatedDates[index - 1].habitCompletions[habitIndex].completed
          ) {
            return {
              ...habitCompletion,
              streakDays: habitCompletion.completed ? 1 : 0,
            };
          }
          return {
            ...habitCompletion,
            streakDays: habitCompletion.completed
              ? updatedDates[index - 1].habitCompletions[habitIndex]
                  .streakDays + 1
              : 0,
          };
        }
      );

      const allHabitsCompleted = updatedHabitCompletions.every(
        (habit) => habit.completed
      );

      return {
        ...dateEntry,
        habitCompletions: updatedHabitCompletions,
        allHabitsCompleted,
      };
    });
  };

  const handleHabitToggle = (dateIndex: number, habitId: number) => {
    const updatedDates = [...dates];
    const dateEntry = updatedDates[dateIndex];

    const habitCompletionIndex = dateEntry.habitCompletions.findIndex(
      (completion) => completion.habitId === habitId
    );

    if (habitCompletionIndex !== -1) {
      const currentCompletion =
        dateEntry.habitCompletions[habitCompletionIndex];

      currentCompletion.completed = !currentCompletion.completed;

      const updatedDatesWithStreaks = calculateStreaks(updatedDates);
      setDates(updatedDatesWithStreaks);
    }
  };

  const handleDoubleClick = (date: string) => {
    setEditingDate(date);
    setEditedDate(date); // Initialize with the current date value
  };

  const handleSaveDate = (dateIndex: number) => {
    const updatedDates = [...dates];
    const dateEntry = updatedDates[dateIndex];

    // Update the date only if it's different
    if (editedDate !== dateEntry.date) {
      dateEntry.date = editedDate;
      const updatedDatesWithStreaks = calculateStreaks(updatedDates);
      setDates(updatedDatesWithStreaks);
    }
    setEditingDate(null); // Exit the editing state
  };

  const handleCancelEdit = () => {
    setEditingDate(null); // Exit the editing state without saving
  };

  const handleDeleteRow = (dateIndex: number) => {
    const updatedDates = dates.filter((_, index) => index !== dateIndex);
    setDates(updatedDates);
  };

  return (
    <div className="max-w-4xl overflow-x-auto">
      <button
        onClick={() => {
          const newDateEntry = {
            date: new Date().toLocaleDateString(),
            habitCompletions: habits.map((habit) => ({
              habitId: habit.id,
              completed: false,
              streakDays: 0,
            })),
            allHabitsCompleted: false,
          };
          setDates([...dates, newDateEntry]);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add New Date
      </button>
      <table className="w-full min-w-max table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left whitespace-nowrap">Σ</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Day</th>
            {habits.map((habit) => (
              <th
                key={habit.id}
                className="px-4 py-2 text-left whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <span>{habit.icon}</span>
                  <span>{habit.name}</span>
                </div>
              </th>
            ))}
            <th className="px-4 py-2 text-left whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((dateEntry, dateIndex) => (
            <tr key={dateEntry.date} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={dateEntry.allHabitsCompleted}
                  readOnly
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-not-allowed"
                />
              </td>
              <td
                className="px-4 py-2 text-left text-gray-600 whitespace-nowrap"
                onDoubleClick={() => handleDoubleClick(dateEntry.date)}
              >
                {editingDate === dateEntry.date ? (
                  <div className="flex items-center gap-2 date-column-edit">
                    <input
                      type="text"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className="border p-1 rounded w-24"
                      onBlur={() => handleSaveDate(dateIndex)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveDate(dateIndex);
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                    />
                  </div>
                ) : (
                  dateEntry.date
                )}
              </td>
              {habits.map((habit) => {
                const habitCompletion = dateEntry.habitCompletions.find(
                  (completion) => completion.habitId === habit.id
                );
                return (
                  <td
                    key={`${dateEntry.date}-${habit.id}`}
                    className="px-4 py-2"
                  >
                    <HabitToggle
                      checked={habitCompletion?.completed || false}
                      onChange={() => handleHabitToggle(dateIndex, habit.id)}
                      streakDays={habitCompletion?.streakDays || 0}
                    />
                  </td>
                );
              })}
              <td className="px-4 py-2 text-left">
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

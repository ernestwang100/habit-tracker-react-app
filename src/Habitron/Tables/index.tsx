import React, { useState } from "react";
import db from "../database"; // Initially loads data
import HabitToggle from "./HabitToggle"; // Assuming HabitToggle is in a separate file

function HabitTrackerTable() {
  const [habits] = useState(db.habits);
  const [dates, setDates] = useState(db.dates);

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

      // Send PUT request to update the JSON file in the backend
      fetch("/api/dates", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDatesWithStreaks),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
  };

  // Add new date row
  const handleAddNewRow = () => {
    const newDateEntry = {
      date: new Date().toLocaleDateString(), // You can format this as needed
      habitCompletions: habits.map((habit) => ({
        habitId: habit.id,
        completed: false,
        streakDays: 0,
      })),
      allHabitsCompleted: false,
    };

    setDates([...dates, newDateEntry]);
  };

  // Handle double-click on date to modify it
  const handleDateDoubleClick = (dateIndex: number) => {
    const updatedDates = [...dates];
    const dateEntry = updatedDates[dateIndex];

    // Toggle the date entry to an editable state
    const updatedDate = prompt("Edit the date:", dateEntry.date);
    if (updatedDate) {
      dateEntry.date = updatedDate;
      setDates(updatedDates);
    }
  };

  return (
    <div className="max-w-4xl overflow-x-auto">
      <button
        onClick={handleAddNewRow}
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
                  aria-label={`All habits completed for ${dateEntry.date}`}
                />
              </td>
              <td
                onDoubleClick={() => handleDateDoubleClick(dateIndex)} // Handle double-click to edit
                className="px-4 py-2 text-left text-gray-600 whitespace-nowrap cursor-pointer"
              >
                {dateEntry.date}
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
                      onChange={(e) => handleHabitToggle(dateIndex, habit.id)}
                      streakDays={habitCompletion?.streakDays || 0}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HabitTrackerTable;

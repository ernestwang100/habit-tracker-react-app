import React, { useState } from "react";
import db from "../database";

// Helper Component for Habit Toggle Input
const HabitToggle = ({ checked, onChange, streakDays }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
      aria-label="Toggle habit completion"
    />
    {streakDays > 0 && (
      <span className="text-sm text-blue-500">{streakDays}</span>
    )}
  </div>
);

function HabitTrackerTable() {
  const [habits] = useState(db.habits);
  const [dates, setDates] = useState(db.dates);

  console.log(habits);
  console.log(dates);

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

  const handleHabitToggle = (dateIndex, habitId) => {
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

  return (
    <div className="max-w-4xl overflow-x-auto">
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
              <td className="px-4 py-2 text-left text-gray-600 whitespace-nowrap">
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
                      onChange={() => handleHabitToggle(dateIndex, habit.id)}
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

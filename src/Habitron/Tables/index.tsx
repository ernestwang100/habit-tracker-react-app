import React, { useState, useEffect } from "react";
import habitsData from "../database/habits.json";
import datesData from "../database/dates.json";

const HabitTrackerTable = () => {
  const [habits] = useState(habitsData.habits);
  const [dates, setDates] = useState(datesData.dates);

  const calculateStreaks = (updatedDates) => {
    return updatedDates.map((dateEntry, index) => {
      // Copy the current date's habit completions
      const updatedHabitCompletions = dateEntry.habitCompletions.map(
        (habitCompletion, habitIndex) => {
          // If this is the first date or the previous date's habit was not completed
          if (
            index === 0 ||
            !updatedDates[index - 1].habitCompletions[habitIndex].completed
          ) {
            return {
              ...habitCompletion,
              streakDays: habitCompletion.completed ? 1 : 0,
            };
          }

          // Continue streak if current habit is completed
          return {
            ...habitCompletion,
            streakDays: habitCompletion.completed
              ? updatedDates[index - 1].habitCompletions[habitIndex]
                  .streakDays + 1
              : 0,
          };
        }
      );

      // Check if all habits are completed for this date
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

    // Find and toggle the specific habit
    const habitCompletionIndex = dateEntry.habitCompletions.findIndex(
      (completion) => completion.habitId === habitId
    );

    if (habitCompletionIndex !== -1) {
      const currentCompletion =
        dateEntry.habitCompletions[habitCompletionIndex];

      // Toggle the completed status
      currentCompletion.completed = !currentCompletion.completed;

      // Recalculate streaks for all dates
      const updatedDatesWithStreaks = calculateStreaks(updatedDates);

      setDates(updatedDatesWithStreaks);
    }
  };

  return (
    <div className="max-w-4xl overflow-x-auto">
      <table className="w-full min-w-max">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left whitespace-nowrap">Σ</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Aa Day</th>
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
            <tr key={dateEntry.label} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={dateEntry.allHabitsCompleted}
                  readOnly
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-not-allowed"
                />
              </td>
              <td className="px-4 py-2 text-left text-gray-600 whitespace-nowrap">
                {dateEntry.label}
              </td>
              {habits.map((habit) => {
                const habitCompletion = dateEntry.habitCompletions.find(
                  (completion) => completion.habitId === habit.id
                );
                return (
                  <td
                    key={`${dateEntry.label}-${habit.id}`}
                    className="px-4 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={habitCompletion?.completed || false}
                        onChange={() => handleHabitToggle(dateIndex, habit.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      {habitCompletion && habitCompletion.streakDays > 0 && (
                        <span className="text-sm text-blue-500">
                          {habitCompletion.streakDays}
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitTrackerTable;

import React, { useState, useEffect } from "react";

const HabitTrackerTable = () => {
  const habits = [
    { id: 1, name: "Running", icon: "🏃" },
    { id: 2, name: "Meditation", icon: "🧘" },
    { id: 3, name: "8hrs of sleep", icon: "💤" },
    { id: 4, name: "Journaling", icon: "✍️" },
  ];

  // Generate dates for the last 20 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    // Special dates
    dates.push({ date: new Date(), label: "@Today" });
    dates.push({
      date: new Date(today.setDate(today.getDate() - 1)),
      label: "@Yesterday",
    });
    dates.push({
      date: new Date(today.setDate(today.getDate() - 1)),
      label: "@Monday",
    });
    dates.push({
      date: new Date(today.setDate(today.getDate() - 1)),
      label: "@Last Sunday",
    });
    dates.push({
      date: new Date(today.setDate(today.getDate() - 1)),
      label: "@Last Saturday",
    });

    // Add more dates
    for (let i = 5; i < 20; i++) {
      const date = new Date(today.setDate(today.getDate() - 1));
      dates.push({
        date,
        label: `@${date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`,
      });
    }

    return dates;
  };

  const [dates] = useState(generateDates());
  const [checkedState, setCheckedState] = useState(
    new Array(dates.length * habits.length).fill(false)
  );
  const [sigmaChecked, setSigmaChecked] = useState(
    new Array(dates.length).fill(false)
  );

  const getCheckboxIndex = (dateIndex, habitIndex) => {
    return dateIndex * habits.length + habitIndex;
  };

  // Check if all habits are completed for a given date
  const isRowComplete = (dateIndex) => {
    return habits.every(
      (_, habitIndex) => checkedState[getCheckboxIndex(dateIndex, habitIndex)]
    );
  };

  // Update sigma states whenever checkboxes change
  useEffect(() => {
    const newSigmaState = dates.map((_, dateIndex) => isRowComplete(dateIndex));
    setSigmaChecked(newSigmaState);
  }, [checkedState]);

  const handleCheckboxChange = (dateIndex, habitIndex) => {
    const index = getCheckboxIndex(dateIndex, habitIndex);
    setCheckedState((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="max-w-4xl overflow-x-auto">
      <table className="w-full min-w-max">
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
          {dates.map((dateInfo, dateIndex) => (
            <tr key={dateInfo.label} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={sigmaChecked[dateIndex]}
                  readOnly
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-not-allowed"
                />
              </td>
              <td className="px-4 py-2 text-left text-gray-600 whitespace-nowrap">
                {dateInfo.label}
              </td>
              {habits.map((habit, habitIndex) => (
                <td key={`${dateInfo.label}-${habit.id}`} className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={
                      checkedState[getCheckboxIndex(dateIndex, habitIndex)]
                    }
                    onChange={() => handleCheckboxChange(dateIndex, habitIndex)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitTrackerTable;

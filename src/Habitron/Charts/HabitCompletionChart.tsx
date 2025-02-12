import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HabitCompletion {
  habitId: number;
  completed: boolean;
}

interface DateEntry {
  date: string;
  habitCompletions: HabitCompletion[];
}

interface Props {
  habitLogs: DateEntry[];
}

const HabitCompletionChart: React.FC<Props> = ({ habitLogs }) => {
  if (!habitLogs.length) return <p>No data available</p>;

  // Extract unique habit IDs
  const habitIds = [
    ...new Set(
      habitLogs.flatMap((entry) => entry.habitCompletions.map((h) => h.habitId))
    ),
  ];

  // Calculate habit completion percentage
  const habitCompletionData = habitIds.map((habitId) => {
    const totalDays = habitLogs.length;
    const completedDays = habitLogs.filter((entry) =>
      entry.habitCompletions.some((h) => h.habitId === habitId && h.completed)
    ).length;

    return {
      habitId,
      completionRate: Math.round((completedDays / totalDays) * 100),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={habitCompletionData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey="habitId"
          label={{ value: "Habit ID", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          label={{ value: "Completion %", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="completionRate" fill="#82ca9d" name="Completion %" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HabitCompletionChart;

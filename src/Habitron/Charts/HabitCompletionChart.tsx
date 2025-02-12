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

interface Habit {
  id: number;
  name: string;
}

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
  habits: Habit[];
  colorPalette?: string[]; // Allow users to pass custom colors
}

const HabitCompletionChart: React.FC<Props> = ({
  habitLogs,
  habits,
  colorPalette,
}) => {
  if (!habitLogs.length || !habits.length) return <p>No data available</p>;

  // Extract unique habits
  const habitData = habits.map((habit) => {
    const totalDays = habitLogs.length;
    const completedDays = habitLogs.filter((entry) =>
      entry.habitCompletions.some((h) => h.habitId === habit.id && h.completed)
    ).length;

    return {
      habitName: habit.name,
      completionRate: Math.round((completedDays / totalDays) * 100),
    };
  });

  // Default color palette if none provided
  const defaultColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#6a0dad"];
  const colors =
    colorPalette && colorPalette.length ? colorPalette : defaultColors;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={habitData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="habitName" angle={-45} textAnchor="end" height={70} />
        <YAxis
          label={{ value: "Completion %", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="completionRate" fill={colors[0]} name="Completion %" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HabitCompletionChart;

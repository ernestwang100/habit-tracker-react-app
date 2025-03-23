import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface HabitLog {
  date: string;
  streakDays: number;
}

interface StreakMainChartProps {
  habitLogs: HabitLog[];
}
function StreakMainChart({ habitLogs }: StreakMainChartProps) {
  // Transform habitLogs into chart-compatible data
  const data = habitLogs.map((log) => ({
    name: log.date, // Use the date as the label
    value: log.streakDays, // Use streakDays for the Y-axis
  }));

  console.log("Rendering chart with data:", data); // Debug log

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StreakMainChart;

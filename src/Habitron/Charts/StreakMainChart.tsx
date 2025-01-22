import React from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";

function StreakMainChart() {
  // Simple test data
  const data = [
    { name: "Day 1", value: 10 },
    { name: "Day 2", value: 20 },
    { name: "Day 3", value: 15 },
    { name: "Day 3", value: 15 },
    { name: "Day 3", value: 15 },
    { name: "Day 3", value: 15 },
  ];

  console.log("Rendering chart with data:", data); // Debug log

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StreakMainChart;

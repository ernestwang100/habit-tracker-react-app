import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Plus } from "lucide-react";
import StreakMainChart from "../Charts/StreakMainChart";
import HabitTrackerTable from "../Tables";
import HabitList from "../HabitList";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("This week");
  const [habits] = useState([
    { id: 1, name: "Journaling", icon: "✍️" },
    { id: 2, name: "Running", icon: "🏃" },
    { id: 3, name: "8hrs of sleep", icon: "💤" },
    { id: 4, name: "Meditation", icon: "🧘" },
  ]);

  const chartData = [
    { date: "January 10, 2025", value: 120 },
    { date: "January 11, 2025", value: 0 },
    { date: "January 12, 2025", value: 0 },
    { date: "January 13, 2025", value: 0 },
  ];

  const habitButtons = [
    { id: 1, text: "Ran today", icon: "🏃" },
    { id: 2, text: "Meditated", icon: "🧘" },
    { id: 3, text: "Got 8hrs", icon: "💤" },
    { id: 4, text: "Journaled", icon: "✍️" },
  ];

  const habitLogs = useSelector((state: RootState) => state.habitLogs);

  const renderContent = () => {
    switch (activeTab) {
      case "Streak":
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <HabitTrackerTable />
          </div>
        );
      default:
        return (
          <>
            {/* Habits Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Habits</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Today's Habits */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 mb-4">@Today</h3>
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-2 mb-3"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <span>{habit.icon}</span>
                      <span>{habit.name}</span>
                    </div>
                  ))}
                </div>

                {/* Yesterday's Habits */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 mb-4">@Yesterday</h3>
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-2 mb-3"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <span>{habit.icon}</span>
                      <span>{habit.name}</span>
                    </div>
                  ))}
                </div>
                <HabitList></HabitList>
                {/* New Page Button */}
                <div className="flex items-center justify-center">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600">
                    <Plus size={20} />
                    <span>New page</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <StreakMainChart habitLogs={habitLogs} />
            </div>

            {/* Streak Graph */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Streak</h2>
              <div className="bg-white p-4 rounded-lg shadow h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Habit Buttons */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Habit Buttons</h3>
              <div className="grid grid-cols-2 gap-2">
                {habitButtons.map((button) => (
                  <button
                    key={button.id}
                    className="flex items-center gap-2 p-2 rounded bg-gray-50 hover:bg-gray-100"
                  >
                    <span>{button.icon}</span>
                    <span>{button.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Top Navigation */}
      <div className="flex gap-4 border-b mb-6">
        {["This week", "This month", "Streak"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}

export default Dashboard;

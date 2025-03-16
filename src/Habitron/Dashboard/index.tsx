// src/pages/Dashboard.tsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchHabitLogs } from "../redux/slices/habitLogsSlice";
import { AppDispatch } from "../redux/store";
import StreakMainChart from "../Charts/StreakMainChart";
import HabitCompletionChart from "../Charts/HabitCompletionChart";
import HabitTrackerTable from "../Tables";
import HabitList from "../HabitList";
import ScheduleTable from "../Schedule";
import ColorPicker from "../Charts/ColorPicker";
import { Plus } from "lucide-react";
import Header from "../../components/Header"; // Import the Header component
import ItinerarySelect from "../Schedule/ItinerarySelect";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("This week");

  const habits = useSelector((state: RootState) => state.habits.habits);
  const habitLogs = useSelector(
    (state: RootState) => state.habitLogs.habitLogs
  );
  const colorPalette = useSelector((state: RootState) => state.colors.colors);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHabitLogs());
  }, [dispatch]);

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
                <HabitList />

                {/* itinerary */}
                <ItinerarySelect></ItinerarySelect>
                <ScheduleTable />
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
              <ColorPicker />
              <HabitCompletionChart
                habitLogs={habitLogs}
                habits={habits}
                colorPalette={colorPalette}
              />

              <h2 className="text-xl font-semibold mb-4">Streak</h2>
            </div>
          </>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Render the Header component at the top */}
      <Header />

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

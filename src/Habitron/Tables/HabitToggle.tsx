// HabitToggle.tsx
import React from "react";

interface HabitToggleProps {
  checked: boolean;
  onChange: () => void;
  streakDays: number;
}

const HabitToggle: React.FC<HabitToggleProps> = ({
  checked,
  onChange,
  streakDays,
}) => {
  return (
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
};

export default HabitToggle;

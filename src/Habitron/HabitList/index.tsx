// HabitList.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  Habit,
  HabitsState,
  fetchHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  setCurrentHabit,
  clearError,
} from "../redux/slices/habitsSlice";
import "./index.css";

export const useAppDispatch = () => useDispatch<AppDispatch>();

function HabitList() {
  const dispatch = useAppDispatch();
  const { habits, currentHabit, status, error } = useSelector(
    (state: RootState) => state.habits
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchHabits());
    }
  }, [status, dispatch]);

  const handleAdd = () => {
    if (status !== "loading") {
      dispatch(addHabit({ name: "New Habit", icon: "⭐" }));
    }
  };

  const handleUpdate = () => {
    if (currentHabit) {
      dispatch(updateHabit(currentHabit));
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteHabit(id));
  };

  const handleEditClick = (habit: Habit) => {
    dispatch(setCurrentHabit(habit));
  };

  const handleErrorDismiss = () => {
    dispatch(clearError());
  };

  if (status === "loading") {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="habits-container">
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={handleErrorDismiss}>Dismiss</button>
        </div>
      )}

      <div className="habits-header">
        <h2>My Habits</h2>
        <button
          className="add-button"
          onClick={handleAdd}
          disabled={status === "loading"}
        >
          Add Habit
        </button>
      </div>

      {currentHabit && (
        <div className="edit-form">
          <input
            value={currentHabit.name}
            onChange={(e) =>
              dispatch(
                setCurrentHabit({
                  ...currentHabit,
                  name: e.target.value,
                })
              )
            }
          />
          <input
            value={currentHabit.icon}
            onChange={(e) =>
              dispatch(
                setCurrentHabit({
                  ...currentHabit,
                  icon: e.target.value,
                })
              )
            }
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => dispatch(setCurrentHabit(null))}>
            Cancel
          </button>
        </div>
      )}

      {habits.length === 0 ? (
        <div>No habits available. Add some!</div>
      ) : (
        <ul className="habits-list">
          {habits.map((habit) => (
            <li key={habit.id} className="habit-item">
              {/* Left side: Icon + Name */}
              <div className="habit-info">
                <span className="habit-icon">{habit.icon}</span>
                <span className="habit-name">{habit.name}</span>
              </div>

              {/* Right side: Edit & Delete buttons */}
              <div className="habit-actions">
                <button onClick={() => handleEditClick(habit)}>Edit</button>
                <button onClick={() => handleDelete(habit.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HabitList;

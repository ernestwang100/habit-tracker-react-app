import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Updated import for React Router v6
import { logout } from "../Habitron/redux/slices/authSlice"; // Import the logout action

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Updated hook to useNavigate

  const handleLogout = () => {
    // Dispatch the logout action from your Redux slice
    dispatch(logout());

    // Redirect to login page after logout (using useNavigate)
    navigate("/login"); // Redirect to the login page
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-semibold">Habitron Dashboard</div>

      {/* Log Out Button */}
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
        >
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Header;

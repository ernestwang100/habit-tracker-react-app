import Dashboard from "./Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AuthRoutes from "./routes/authRoutes";
import ProtectedRoute from "./routes/protectedRoute";

function Habitron() {
  return (
    <div>
      <Provider store={store}>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/*" element={<AuthRoutes />} />
          {/* <Route path="/" element={<Navigate to="Dashboard" />} /> */}
          {/* <Route path="Dashboard" element={<Dashboard />}></Route> */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route path="" element={<Dashboard />} />
          </Route>
        </Routes>
      </Provider>
    </div>
  );
}

export default Habitron;

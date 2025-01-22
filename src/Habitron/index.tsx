import Dashboard from "./Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";

function Habitron() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="Dashboard" />} />
        <Route path="Dashboard" element={<Dashboard />}></Route>
      </Routes>
    </div>
  );
}

export default Habitron;

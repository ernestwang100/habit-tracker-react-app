import Dashboard from "./Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function Habitron() {
  return (
    <div>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Navigate to="Dashboard" />} />
          <Route path="Dashboard" element={<Dashboard />}></Route>
        </Routes>
      </Provider>
    </div>
  );
}

export default Habitron;

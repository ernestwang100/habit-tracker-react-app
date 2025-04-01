import "./App.css";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Habitron from "./Habitron";
import LandingPage from "./Habitron/pages/LandingPage";

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/Habitron" />} />
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/Habitron/*" element={<Habitron />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Habitron from "./Habitron";

function App() {
  const [count, setCount] = useState(0);

  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/Habitron" />} />
          <Route path="/Habitron/*" element={<Habitron />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;

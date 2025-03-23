import { Routes, Route } from "react-router-dom";
import { Signup } from "../Users/authForm";
import { Login } from "../Users/authForm";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AuthRoutes;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthForm: React.FC<{ isSignup: boolean }> = ({ isSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const response = await axios.post(endpoint, { email, password });
      dispatch(setUser(response.data));
      navigate("/dashboard");
    } catch (err) {
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
      </form>
    </div>
  );
};

export const Signup = () => <AuthForm isSignup={true} />;
export const Login = () => <AuthForm isSignup={false} />;

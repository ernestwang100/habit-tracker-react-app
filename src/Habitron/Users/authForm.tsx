import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, loginUser } from "../redux/slices/authSlice";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css"; // Assuming you have a CSS file for styling

const AuthForm: React.FC<{ isSignup: boolean }> = ({ isSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signupUser({ email, password }) as any);
    } else {
      dispatch(loginUser({ email, password }) as any);
    }
  };

  const basePath =
    window.location.hash.split("#")[1]?.split("/").slice(0, -1).join("/") || "";

  // Navigate when auth succeeds
  useEffect(() => {
    if (status === "succeeded") {
      navigate(`${basePath}/dashboard`);
    }
  }, [status, navigate]);

  return (
    <div className="auth-container">
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
      {status === "failed" && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="auth-button"
        >
          {status === "loading"
            ? "Processing..."
            : isSignup
            ? "Sign Up"
            : "Log In"}
        </button>
      </form>
      <p className="auth-toggle">
        {isSignup ? "Already have an account? " : "Don't have an account? "}
        <button
          onClick={() =>
            navigate(`${basePath}/${isSignup ? "login" : "signup"}`)
          }
          className="toggle-button"
        >
          {isSignup ? "Log In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export const Signup = () => <AuthForm isSignup={true} />;
export const Login = () => <AuthForm isSignup={false} />;

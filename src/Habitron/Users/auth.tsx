import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, loginUser } from "../redux/slices/authSlice";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

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

  // Navigate when auth succeeds
  React.useEffect(() => {
    if (status === "succeeded") {
      navigate("/dashboard");
    }
  }, [status, navigate]);

  return (
    <div className="auth-container">
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
      {status === "failed" && <p className="error">{error}</p>}
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
        <button type="submit" disabled={status === "loading"}>
          {status === "loading"
            ? "Processing..."
            : isSignup
            ? "Sign Up"
            : "Log In"}
        </button>
      </form>
    </div>
  );
};

export const Signup = () => <AuthForm isSignup={true} />;
export const Login = () => <AuthForm isSignup={false} />;

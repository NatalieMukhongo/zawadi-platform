import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom"; // 
import { useAuth } from "../context/AuthContext";
import "./Login.css";

// Login page component that handles user authentication and redirects based on role
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userRole } = useAuth();

  useEffect(() => {
    if (userRole === "mentor") navigate("/mentor-dashboard");
    if (userRole === "student") navigate("/student-dashboard");
  }, [userRole, navigate]); // runs whenever userRole or navigate changes

  async function handleLogin() {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    // Set loading state to true while attempting login
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const user = credential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists() || !userDoc.data().role) {
        throw new Error("Unable to determine your account role. Please contact support.");
      }

      const role = userDoc.data().role;
      navigate(role === "mentor" ? "/mentor-dashboard" : "/student-dashboard");
    } catch (err) {
      setError(err.message.includes("auth/") ? "Invalid email or password." : err.message);
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleLogin();
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <p className="login-brand">Zawadi Platform</p>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Log in to continue to your student or mentor dashboard.</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="login-field">
            <span className="login-label">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              type="email"
              placeholder="you@example.com"
            />
          </label>

          <label className="login-field">
            <span className="login-label">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              type="password"
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" disabled={loading} className="login-submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

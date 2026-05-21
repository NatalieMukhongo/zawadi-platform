import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  }, [userRole, navigate]);

  async function handleLogin() {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-green-100">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green-600 font-semibold">Zawadi Platform</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Log in to continue to your student or mentor dashboard.</p>
        </div>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">{error}</div>}

        <label className="block mb-4">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            type="email"
            placeholder="you@example.com"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            type="password"
            placeholder="Enter your password"
          />
        </label>

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account? <Link to="/register" className="font-semibold text-green-700 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
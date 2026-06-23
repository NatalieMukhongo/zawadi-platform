import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleRegister () {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // save user's role to firestore
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                role: role
            });

            navigate(role === "mentor" ? "/mentor-dashboard" : "/student-dashboard");
        } catch (err) {
            setError(err.message);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        handleRegister();
    }
    
    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <h2 className="register-title">Create Account</h2>
                </div>

                {error && <div className="register-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label className="register-field">
                        <span className="register-label">Email</span>
                        <input
                            className="register-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label className="register-field">
                        <span className="register-label">Password</span>
                        <input
                            className="register-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <label className="register-field">
                        <span className="register-label">Role</span>
                        <select
                            className="register-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                        </select>
                    </label>

                    <button type="submit" className="register-submit">
                        Register
                    </button>
                </form>

                <p className="register-footer">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>  
        </div>
    );
}

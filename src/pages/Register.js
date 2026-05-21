import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleRegister () {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth,email, password);
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
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 " >
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-green-800">Create Account</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    className="w-full border p-2 rounded mb-4"
                    type="email"
                    placeholder="email"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className="w-full border p-2 rounded mb-4"
                    type="password"
                    placeholder="password"
                    onChange={e => setPassword(e.target.value)}
                />
                <select
                    className="w-full border p-2 rounded mb-4"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                </select>
                <button
                    className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                    onClick={handleRegister}
                >
                    Register
                </button>
                <p className="mt-4 text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-green-600 hover:underline">Login</a>
                </p>
            </div>  
        </div>
    )
}
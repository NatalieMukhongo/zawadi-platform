import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    // Fetch their role from Firestore
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    setUserRole(docSnap.exists() ? docSnap.data().role : null);
                } else {
                    setUserRole(null);
                }
            } catch (err) {
                console.error("Failed to fetch user role:", err);
                setUserRole(null);
            } finally {
                setCurrentUser(user);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);
    
    function logout() {
        return signOut(auth);
    }

    const value = { currentUser, userRole, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
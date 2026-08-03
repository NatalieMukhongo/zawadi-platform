import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole && userRole !== allowedRole) {
    return <Navigate to={userRole === "mentor" ? "/mentor-dashboard" : "/student-dashboard"} replace />;
  }

  if (allowedRole && !userRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

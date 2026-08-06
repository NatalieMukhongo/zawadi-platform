import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import SchoolDetail from "./pages/SchoolDetail";
import ComingSoon from "./pages/ComingSoon";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor-dashboard"
            element={
              <ProtectedRoute allowedRole="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/:schoolId"
            element={
              <ProtectedRoute allowedRole="student">
                <SchoolDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sat-prep"
            element={
              <ProtectedRoute allowedRole="student">
                <ComingSoon title="SAT Prep" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sat-prep/continue"
            element={
              <ProtectedRoute allowedRole="student">
                <ComingSoon title="Continue Prep" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sat-prep/quiz"
            element={
              <ProtectedRoute allowedRole="student">
                <ComingSoon title="Pop Quiz" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sat-prep/mock-test"
            element={
              <ProtectedRoute allowedRole="student">
                <ComingSoon title="Mock Test" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

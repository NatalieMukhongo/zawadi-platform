import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import SchoolDetail from "./pages/SchoolDetail";
import ComingSoon from "./pages/ComingSoon";
import EssayHubLayout from "./pages/EssayHubLayout";
import EssayDashboardTab from "./pages/EssayDashboardTab";
import EssaySupplementalTab from "./pages/EssaySupplementalTab";
import EssayEditorPage from "./pages/EssayEditorPage";
import EssayPersonalStatementTab from "./pages/EssayPersonalStatementTab";
import EssayResourceLibrary from "./pages/EssayResourceLibrary";
import EssayShowTellTab from "./pages/EssayShowTellTab";
import { PERSONAL_STATEMENT_ID } from "./lib/essaysApi";

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
            path="/essays"
            element={
              <ProtectedRoute allowedRole="student">
                <EssayHubLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EssayDashboardTab />} />
            <Route path={PERSONAL_STATEMENT_ID} element={<EssayPersonalStatementTab />} />
            <Route path="supplemental" element={<EssaySupplementalTab />} />
            <Route path="resources" element={<EssayResourceLibrary />} />
            <Route path="show-tell" element={<EssayShowTellTab />} />
            <Route path=":essayId" element={<EssayEditorPage />} />
          </Route>
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

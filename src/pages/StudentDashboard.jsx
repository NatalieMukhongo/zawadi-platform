import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../lib/studentDashboardApi";
import LogoutButton from "../components/LogoutButton";
import Sidebar from "../components/student/Sidebar";
import MentorCard from "../components/student/MentorCard";
import SchoolListSection from "../components/student/SchoolListSection";
import SatPrepSection from "../components/student/SatPrepSection";
import CommonAppSection from "../components/student/CommonAppSection";

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getUserProfile(currentUser.uid)
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser.uid]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-50 to-green-100">
      <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-green-700 px-6 py-4 shadow-lg shadow-orange-900/50">
        
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
        >
          <span className="block h-0.5 w-5 bg-white" />
          <span className="block h-0.5 w-5 bg-white" />
          <span className="block h-0.5 w-5 bg-white" />
        </button>

        <h1 className="text-2xl font-bold text-white">
          Welcome, {profile?.displayName || "Student"}
        </h1>

        <LogoutButton />
      </div>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        uid={currentUser.uid}
        profile={profile}
        onProfileSaved={(fields) => setProfile((prev) => ({ ...prev, ...fields }))}
      />

      {loading ? (
        <p className="p-6 text-gray-600">Loading your dashboard...</p>
      ) : error ? (
        <p className="p-6 text-red-600">{error}</p>
      ) : (
        <div className="p-6">
          <MentorCard mentorId={profile?.mentorId} />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SchoolListSection uid={currentUser.uid} />
            <SatPrepSection uid={currentUser.uid} />
          </div>

          <div className="mt-6">
            <CommonAppSection uid={currentUser.uid} />
          </div>
        </div>
      )}
    </div>
  );
}

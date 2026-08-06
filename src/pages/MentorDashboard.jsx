import LogoutButton from "../components/LogoutButton";

export default function MentorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 via-white to-orange-50/40">
      <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-green-700 px-6 py-4 shadow-md">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500" />
        <h1 className="text-2xl font-bold text-white">Welcome, Mentor</h1>
        <LogoutButton />
      </div>
      <p className="p-6 text-gray-600">Your dashboard is being built.</p>
    </div>
  );
}
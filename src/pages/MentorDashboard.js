import LogoutButton from "../components/LogoutButton";

export default function MentorDashboard() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-800">Welcome, Mentor</h1>
        <LogoutButton />
      </div>
      <p className="mt-2 text-gray-600">Your dashboard is being built.</p>
    </div>
  );
}
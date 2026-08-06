import { Link } from "react-router-dom";

export default function ComingSoon({ title }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50/60 via-white to-orange-50/40 p-6 text-center">
      <span className="mb-3 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
        Coming soon
      </span>
      <h1 className="text-2xl font-bold text-green-800">{title}</h1>
      <p className="mt-2 text-gray-600">This is coming soon.</p>
      <Link to="/student-dashboard" className="mt-4 text-sm font-semibold text-green-800 underline hover:text-orange-600">
        Back to dashboard
      </Link>
    </div>
  );
}

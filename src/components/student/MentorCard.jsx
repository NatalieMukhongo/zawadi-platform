import { useEffect, useState } from "react";
import { getMentorProfile } from "../../lib/studentDashboardApi";

export default function MentorCard({ mentorId }) {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(!!mentorId);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mentorId) {
      setMentor(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getMentorProfile(mentorId)
      .then(setMentor)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [mentorId]);

  return (
    <div className="rounded-2xl border border-gray-200 border-l-4 border-l-green-600 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Your Mentor
      </p>
      {loading ? (
        <p className="mt-1 text-sm text-gray-500">Loading...</p>
      ) : error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : mentor ? (
        <p className="mt-1 font-semibold text-gray-900">{mentor.displayName || mentor.email}</p>
      ) : (
        <p className="mt-1 text-sm text-gray-500">No mentor assigned yet.</p>
      )}
    </div>
  );
}

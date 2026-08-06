import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getSchool,
  updateSchoolChecklist,
  updateSchoolDeadline,
  removeSchool,
} from "../lib/studentDashboardApi";

const CHECKLIST_LABELS = {
  essaysSubmitted: "Essays submitted",
  activitiesReviewed: "Activities reviewed",
  personalStatementLinked: "Personal statement linked",
  applicationSubmitted: "Application submitted",
};

export default function SchoolDetail() {
  const { currentUser } = useAuth();
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSchool(currentUser.uid, schoolId)
      .then(setSchool)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser.uid, schoolId]);

  async function handleToggleChecklistItem(key) {
    const nextChecklist = { ...school.checklist, [key]: !school.checklist[key] };
    setSchool((prev) => ({ ...prev, checklist: nextChecklist }));
    try {
      await updateSchoolChecklist(currentUser.uid, schoolId, nextChecklist);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateDeadline(deadline) {
    setSchool((prev) => ({ ...prev, deadline }));
    try {
      await updateSchoolDeadline(currentUser.uid, schoolId, deadline);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemove() {
    try {
      await removeSchool(currentUser.uid, schoolId);
      navigate("/student-dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 via-white to-orange-50/40 p-6">
      <Link to="/student-dashboard" className="text-sm text-gray-600 underline hover:text-orange-600">
        &larr; Back to dashboard
      </Link>

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : !school ? (
        <p className="mt-4 text-red-600">{error || "School not found."}</p>
      ) : (
        <div className="mt-4 max-w-xl rounded-2xl border border-gray-200 border-l-4 border-l-green-600 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-green-800">{school.name}</h1>
          <p className="mt-1 text-gray-500">
            {school.city}, {school.state}
          </p>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <label className="mt-6 block">
            <span className="text-sm font-medium text-gray-700">Deadline</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={school.deadline || ""}
              onChange={(e) => handleUpdateDeadline(e.target.value)}
            />
          </label>

          <div className="mt-4 space-y-2">
            {Object.keys(CHECKLIST_LABELS).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={!!school.checklist?.[key]}
                  onChange={() => handleToggleChecklistItem(key)}
                />
                {CHECKLIST_LABELS[key]}
              </label>
            ))}
          </div>

          <button onClick={handleRemove} className="mt-6 text-sm text-red-600 underline">
            Remove this school
          </button>
        </div>
      )}
    </div>
  );
}

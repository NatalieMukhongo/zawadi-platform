import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listSchools, addSchool } from "../../lib/studentDashboardApi";
import SchoolSearchBar from "./SchoolSearchBar";

const VISIBLE_COUNT = 3;

export default function SchoolListSection({ uid }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    listSchools(uid)
      .then(setSchools)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [uid]);

  const existingScorecardIds = useMemo(
    () => new Set(schools.map((s) => s.scorecardId)),
    [schools]
  );

  async function handleSelectSchool(school) {
    try {
      await addSchool(uid, school);
      setSchools((prev) => [...prev, { id: school.scorecardId, ...school }]);
      setSearchOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleSchools = showAll ? schools : schools.slice(0, VISIBLE_COUNT);

  return (
    <section className="rounded-2xl border border-gray-200 border-l-4 border-l-green-600 bg-white p-5 shadow-sm">
      <div className="relative flex items-center justify-center">
        <h2 className="text-xl font-bold text-green-800">My Schools</h2>
        <button
          onClick={() => setSearchOpen((prev) => !prev)}
          aria-label="Add a school"
          className="absolute right-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white hover:bg-orange-700"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        </button>
      </div>

      {searchOpen && (
        <div className="mt-3">
          <SchoolSearchBar
            onSelectSchool={handleSelectSchool}
            existingScorecardIds={existingScorecardIds}
          />
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : schools.length === 0 ? (
          <p className="text-sm text-gray-500">No schools added yet — tap + to add one.</p>
        ) : (
          visibleSchools.map((school) => (
            <Link
              key={school.id}
              to={`/schools/${school.id}`}
              className="block rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">{school.name}</span>
              <span className="text-gray-500"> &middot; {school.city}, {school.state}</span>
            </Link>
          ))
        )}
      </div>

      {schools.length > VISIBLE_COUNT && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-3 text-sm text-green-800 underline"
        >
          {showAll ? "See less" : `See more (${schools.length - VISIBLE_COUNT})`}
        </button>
      )}
    </section>
  );
}

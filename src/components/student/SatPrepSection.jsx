import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSatPrepSummary } from "../../lib/studentDashboardApi";
import CircularProgress from "./CircularProgress";

export default function SatPrepSection({ uid }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSatPrepSummary(uid)
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [uid]);

  return (
    <section className="rounded-2xl border border-gray-200 border-l-4 border-l-orange-500 bg-white p-5 shadow-sm">
      <div className="text-center">
        <Link to="/sat-prep" className="text-xl font-bold text-green-800 hover:underline">
          SAT Prep
        </Link>
      </div>

      {loading ? (
        <p className="mt-3 text-sm text-gray-500">Loading...</p>
      ) : error ? (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      ) : (
        <div className="mt-4 flex items-center justify-center gap-80">
          <CircularProgress value={summary?.latestScore ?? null} max={1600} />

          <div className="flex flex-col gap-3 text-sm font-semibold">
            <Link to="/sat-prep/continue" className="text-green-800 underline">
              Continue prep
            </Link>
            <Link to="/sat-prep/quiz" className="text-green-800 underline">
              Pop quiz
            </Link>
            <Link to="/sat-prep/mock-test" className="text-green-800 underline">
              Mock test
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
